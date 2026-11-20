import os, tempfile, threading
from pathlib import Path
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.model import load_model, predict_sequence, SEQ_LEN, FEATURE_SIZE

app = FastAPI(title="SignBridge AI Fast Recognition Service", version="2.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CONFIDENCE_THRESHOLD = float(os.getenv("PSL_CONFIDENCE_THRESHOLD", "0.30"))

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
                    min_hand_detection_confidence=0.15,
                    min_hand_presence_confidence=0.15,
                    min_tracking_confidence=0.15
                )
                _hand_detector = vision.HandLandmarker.create_from_options(hand_opts)

                pose_path = models_dir / "pose_landmarker_lite.task"
                if pose_path.exists():
                    pose_opts = vision.PoseLandmarkerOptions(
                        base_options=python.BaseOptions(model_asset_path=str(pose_path)),
                        min_pose_detection_confidence=0.15,
                        min_pose_presence_confidence=0.15,
                        min_tracking_confidence=0.15
                    )
                    _pose_detector = vision.PoseLandmarker.create_from_options(pose_opts)
    return _hand_detector, _pose_detector

@app.get("/health")
def health():
    return {"status": "healthy", "service": "signbridge-ai", "version": "2.2.0"}

@app.get("/ready")
def ready():
    model, labels = load_model()
    return {"ready": model is not None, "labels": len(labels or [])}

class SequenceRequest(BaseModel):
    frames: list[list[float]]

def normalize_landmarks_to_origin(landmarks_raw):
    pts = np.array(landmarks_raw, dtype=np.float32)
    if pts.shape[0] == 0:
        return pts
    origin = pts[0].copy()
    return pts - origin

def extract_landmarks_from_video(video_path: str):
    import mediapipe as mp
    hand_det, pose_det = get_shared_detectors()

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(400, "Could not open or decode video stream.")

    frames_read = []
    while True:
        ok, frame = cap.read()
        if not ok or len(frames_read) >= 60:
            break
        frames_read.append(frame)
    cap.release()

    if len(frames_read) == 0:
        raise HTTPException(400, "No frames could be read from video recording.")

    # High speed optimization: sample exactly 16 key temporal frames (cut processing time by > 60%)
    sample_count = min(16, len(frames_read))
    sample_indices = np.linspace(0, len(frames_read) - 1, sample_count).astype(int)

    extracted_vectors = []
    last_known_vector = np.zeros(FEATURE_SIZE, dtype=np.float32)

    for idx in sample_indices:
        frame = frames_read[idx]
        h, w = frame.shape[:2]
        # Fast downscale to 320px for rapid landmark inference
        if w > 320:
            frame = cv2.resize(frame, (320, int(h * 320 / w)), interpolation=cv2.INTER_LINEAR)

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        
        # 1. Hands (63 + 63 = 126)
        hand_res = hand_det.detect(mp_img)
        lh_vector = np.zeros((21, 3), dtype=np.float32)
        rh_vector = np.zeros((21, 3), dtype=np.float32)

        if hand_res.hand_landmarks and hand_res.handedness:
            for hand_idx, hand_pts in enumerate(hand_res.hand_landmarks[:2]):
                category_label = ""
                if hand_idx < len(hand_res.handedness) and len(hand_res.handedness[hand_idx]) > 0:
                    category_label = hand_res.handedness[hand_idx][0].category_name

                raw_pts = [[pt.x, pt.y, pt.z] for pt in hand_pts]
                normed_pts = normalize_landmarks_to_origin(raw_pts)

                if category_label == "Left":
                    rh_vector = normed_pts
                elif category_label == "Right":
                    lh_vector = normed_pts
                else:
                    if np.sum(np.abs(rh_vector)) == 0:
                        rh_vector = normed_pts
                    else:
                        lh_vector = normed_pts

        elif hand_res.hand_landmarks:
            for h_idx, hand_pts in enumerate(hand_res.hand_landmarks[:2]):
                raw_pts = [[pt.x, pt.y, pt.z] for pt in hand_pts]
                normed_pts = normalize_landmarks_to_origin(raw_pts)
                if h_idx == 0:
                    rh_vector = normed_pts
                else:
                    lh_vector = normed_pts

        # 2. Pose (33 * 3 = 99)
        pose_vector = np.zeros((33, 3), dtype=np.float32)
        if pose_det:
            pose_res = pose_det.detect(mp_img)
            if pose_res.pose_landmarks and len(pose_res.pose_landmarks) > 0:
                raw_pose = [[pt.x, pt.y, pt.z] for pt in pose_res.pose_landmarks[0]]
                pose_vector = normalize_landmarks_to_origin(raw_pose)

        vec = np.concatenate([lh_vector.reshape(-1), rh_vector.reshape(-1), pose_vector.reshape(-1)])

        if np.sum(np.abs(vec)) > 0.05:
            last_known_vector = vec.copy()
        else:
            vec = last_known_vector.copy()

        extracted_vectors.append(vec)

    # Smoothly resample to 30 frames for the PyTorch LSTM
    idx_map = np.linspace(0, len(extracted_vectors) - 1, SEQ_LEN).astype(int)
    final_sequence = [extracted_vectors[i] for i in idx_map]

    return np.stack(final_sequence).tolist()

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
