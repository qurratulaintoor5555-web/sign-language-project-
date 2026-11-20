import argparse
import time
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "dataset" / "raw"
SEQ_LEN = 30


def get_landmarker():
    from mediapipe.tasks import python
    from mediapipe.tasks.python import vision

    model_path = ROOT / "AI-Service" / "models" / "hand_landmarker.task"
    if not model_path.exists():
        raise RuntimeError(f"Model not found at {model_path}")
    base_options = python.BaseOptions(model_asset_path=str(model_path))
    options = vision.HandLandmarkerOptions(
        base_options=base_options,
        num_hands=2,
        min_hand_detection_confidence=0.5,
        min_hand_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )
    return vision.HandLandmarker.create_from_options(options)


def main():
    p = argparse.ArgumentParser(description="Collect custom sign samples via webcam.")
    p.add_argument("--label", required=True, help="Sign label (e.g., HELLO, WATER)")
    p.add_argument("--signer", required=True, help="Signer pseudonym, e.g. S001")
    p.add_argument("--session", default="SESSION01", help="Session ID")
    p.add_argument(
        "--repetitions", type=int, default=10, help="Number of repetitions to record"
    )
    args = p.parse_args()

    import mediapipe as mp

    label = args.label.strip().upper()
    OUT.mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise RuntimeError("Webcam unavailable. Please verify webcam connection.")

    detector = get_landmarker()
    count = 0
    print(f"=== Recording '{label}' for signer {args.signer} ===")
    print("Press SPACE to record a 3-second sequence; press Q to quit.")

    while count < args.repetitions:
        ok, frame = cap.read()
        if not ok:
            break
        cv2.putText(
            frame,
            f"{label} | Sample: {count + 1}/{args.repetitions} | SPACE=Record, Q=Quit",
            (15, 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2,
        )
        cv2.imshow("SignScribe Dataset Collector", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        if key != 32:  # Spacebar
            continue

        sequence = []
        start = time.time()
        print(f"Recording clip {count + 1}...")
        while len(sequence) < SEQ_LEN and (time.time() - start) < 6.0:
            ok, f = cap.read()
            if not ok:
                break
            h, w = f.shape[:2]
            if w > 640:
                f = cv2.resize(f, (640, int(h * 640 / w)), interpolation=cv2.INTER_AREA)

            rgb = cv2.cvtColor(f, cv2.COLOR_BGR2RGB)
            mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            result = detector.detect(mp_img)

            vector = np.zeros((2, 21, 3), dtype=np.float32)
            if result.hand_landmarks:
                for hi, hand in enumerate(result.hand_landmarks[:2]):
                    for pi, pt in enumerate(hand):
                        vector[hi, pi] = [pt.x, pt.y, pt.z]
            sequence.append(vector.reshape(-1))

            cv2.putText(
                f,
                f"RECORDING: {len(sequence)}/{SEQ_LEN}",
                (15, 35),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 0, 255),
                2,
            )
            cv2.imshow("SignScribe Dataset Collector", f)
            cv2.waitKey(1)

        if len(sequence) < 5:
            print("Insufficient hand frames captured. Retrying...")
            continue

        idx = np.linspace(0, len(sequence) - 1, SEQ_LEN).astype(int)
        seq_arr = np.stack([sequence[i] for i in idx])

        sample_id = (
            f"PSL_{label}_{args.signer}_{args.session}_{int(time.time() * 1000)}"
        )
        save_path = OUT / f"{sample_id}.npy"
        np.save(save_path, seq_arr)
        count += 1
        print(f"Saved: {save_path.name} ({count}/{args.repetitions})")

    cap.release()
    cv2.destroyAllWindows()
    print("Dataset collection finished.")


if __name__ == "__main__":
    main()
