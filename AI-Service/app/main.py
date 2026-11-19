import os, tempfile, threading
from pathlib import Path
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.model import load_model, predict_sequence, SEQ_LEN, FEATURE_SIZE

app = FastAPI(title="IsharaAI Sign Recognition Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CONFIDENCE_THRESHOLD = float(os.getenv("PSL_CONFIDENCE_THRESHOLD", "0.45"))

_detector_lock = threading.Lock()
_hand_detector = None
_pose_detector = None

def get_shared_detectors():
    global _hand_detector, _pose_detector
    if _hand_detector is None or _pose_detector is None:
        with _detector_lock:
            if _hand_detector is None or _pose_detector is None:
                from mediapipe.tasks import python
                from mediapipe.tasks.python import vision
                models_dir = Path(__file__).resolve().parent.parent / "models"
                
                hand_path = models_dir / "hand_landmarker.task"
                if not hand_path.exists():
                    raise RuntimeError(f"Hand landmarker model not found at {hand_path}")
                hand_opts = vision.HandLandmarkerOptions(
                    base_options=python.BaseOptions(model_asset_path=str(hand_path)),
                    num_hands=2,
                    min_hand_detection_confidence=0.2,
                    min_hand_presence_confidence=0.2,
                    min_tracking_confidence=0.2
                )
                _hand_detector = vision.HandLandmarker.create_from_options(hand_opts)

                pose_path = models_dir / "pose_landmarker_lite.task"
                if pose_path.exists():
                    pose_opts = vision.PoseLandmarkerOptions(
                        base_options=python.BaseOptions(model_asset_path=str(pose_path)),
                        min_pose_detection_confidence=0.2,
                        min_pose_presence_confidence=0.2,
                        min_tracking_confidence=0.2
                    )
                    _pose_detector = vision.PoseLandmarker.create_from_options(pose_opts)
    return _hand_detector, _pose_detector

@app.get("/health")
def health():
    return {"status": "healthy", "service": "ishara-ai", "version": "2.0.0"}

@app.get("/ready")
def ready():
    model, labels = load_model()
    return {"ready": model is not None, "labels": len(labels or [])}

class SequenceRequest(BaseModel):
    frames: list[list[float]]

def extract_landmarks_from_video(video_path: str):
    import mediapipe as mp
    hand_det, pose_det = get_shared_detectors()

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(400, "Could not read recorded video clip.")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    sample_indices = set(np.linspace(0, max(0, total_frames - 1), min(35, max(10, total_frames))).astype(int))

    frames = []
    curr_frame_idx = 0
    last_known_vector = np.zeros(FEATURE_SIZE, dtype=np.float32)

    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if curr_frame_idx in sample_indices:
            h, w = frame.shape[:2]
            if w > 640:
                frame = cv2.resize(frame, (640, int(h * 640 / w)), interpolation=cv2.INTER_AREA)

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            
            # 1. Hand landmarks (left: 63, right: 63 -> 126)
            hand_res = hand_det.detect(mp_img)
            lh_vector = np.zeros((21, 3), dtype=np.float32)
            rh_vector = np.zeros((21, 3), dtype=np.float32)
            if hand_res.hand_landmarks:
                for idx, hand in enumerate(hand_res.hand_landmarks[:2]):
                    target = lh_vector if idx == 0 else rh_vector
                    for pt_idx, pt in enumerate(hand):
                        target[pt_idx] = [pt.x, pt.y, pt.z]

            # 2. Pose landmarks (33 * 3 = 99)
            pose_vector = np.zeros((33, 3), dtype=np.float32)
            if pose_det:
                pose_res = pose_det.detect(mp_img)
                if pose_res.pose_landmarks:
                    for pt_idx, pt in enumerate(pose_res.pose_landmarks[0]):
                        pose_vector[pt_idx] = [pt.x, pt.y, pt.z]

            # Concatenate to 225 values: [lh (63), rh (63), pose (99)]
            vec = np.concatenate([lh_vector.reshape(-1), rh_vector.reshape(-1), pose_vector.reshape(-1)])

            if np.sum(np.abs(vec)) > 0.05:
                last_known_vector = vec.copy()
            else:
                vec = last_known_vector.copy()

            frames.append(vec)
        curr_frame_idx += 1

    cap.release()

    if len(frames) < 3:
        raise HTTPException(400, "Video clip was too brief. Please sign for 2 to 3 seconds.")

    indexes = np.linspace(0, len(frames) - 1, SEQ_LEN).astype(int)
    return np.stack([frames[i] for i in indexes]).tolist()

@app.post("/v1/signs/predict-sequence")
def predict(req: SequenceRequest):
    try:
        result = predict_sequence(req.frames, CONFIDENCE_THRESHOLD)
    except ValueError as exc:
        raise HTTPException(422, str(exc))
    if result is None:
        raise HTTPException(503, detail={"code": "model_not_ready", "message": "The model has not been trained yet."})
    return result

@app.post("/v1/signs/predict-video")
async def predict_video(video: UploadFile = File(...)):
    suffix = Path(video.filename or "capture.webm").suffix or ".webm"
    data = await video.read()
    if len(data) > 30 * 1024 * 1024:
        raise HTTPException(413, "Video exceeds 30 MB limit.")
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(data)
            temp_path = tmp.name

        frames = extract_landmarks_from_video(temp_path)
        result = predict_sequence(frames, CONFIDENCE_THRESHOLD)
        if result is None:
            raise HTTPException(503, detail={"code": "model_not_ready", "message": "The model has not been trained yet."})
        return result
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
