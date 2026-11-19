from pathlib import Path
import csv
import json
import numpy as np
import torch
from torch import nn

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "models" / "psl_lstm.pt"
LABELS_PATH = ROOT.parent / "dataset" / "labels" / "psl_words.csv"
SEQ_LEN, FEATURE_SIZE = 30, 225

class PSL_Net(nn.Module):
    def __init__(self, num_classes=26):
        super().__init__()
        self.lstm = nn.LSTM(FEATURE_SIZE, 128, batch_first=True, num_layers=2, dropout=0.2)
        self.fc = nn.Sequential(
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, num_classes)
        )
    def forward(self, x):
        out, _ = self.lstm(x)
        return self.fc(out[:, -1, :])

def load_label_metadata():
    mapping = {}
    if LABELS_PATH.exists():
        with LABELS_PATH.open(newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                mapping[row["label"]] = {
                    "text": row["englishText"],
                    "urdu": row.get("urduText"),
                    "category": row.get("category")
                }
    return mapping

_model_cache = None
_labels_cache = None

def load_model():
    global _model_cache, _labels_cache
    if _model_cache is not None:
        return _model_cache, _labels_cache

    if not MODEL_PATH.exists():
        return None, None

    payload = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
    labels = payload.get("labels", [])
    model = PSL_Net(len(labels))
    model.load_state_dict(payload["state_dict"])
    model.eval()

    _model_cache = model
    _labels_cache = labels
    return model, labels

def predict_sequence(frames, threshold=0.50):
    model, labels = load_model()
    if model is None:
        return None

    arr = np.asarray(frames, dtype=np.float32)
    if arr.shape != (SEQ_LEN, FEATURE_SIZE):
        raise ValueError(f"Expected [{SEQ_LEN},{FEATURE_SIZE}], received {list(arr.shape)}")

    meta_map = load_label_metadata()

    with torch.no_grad():
        tensor_in = torch.from_numpy(arr).unsqueeze(0)
        probs = torch.softmax(model(tensor_in), dim=1)[0]

    # Get top prediction and top 3 alternatives
    top_indices = torch.topk(probs, k=min(3, len(labels)))
    best_idx = int(top_indices.indices[0])
    confidence = float(top_indices.values[0])
    label = labels[best_idx]

    meta = meta_map.get(label, {
        "text": label,
        "urdu": "",
        "category": "Sign"
    })

    alternatives = []
    for i in range(1, len(top_indices.indices)):
        alt_idx = int(top_indices.indices[i])
        alt_label = labels[alt_idx]
        alternatives.append({
            "label": alt_label,
            "confidence": round(float(top_indices.values[i]), 4),
            "englishText": meta_map.get(alt_label, {}).get("text", alt_label)
        })

    # High distinction check: if confidence is below threshold, report need repeat
    needs_repeat = bool(confidence < threshold)

    return {
        "status": "ok",
        "label": label,
        "englishText": meta["text"],
        "urduText": meta.get("urdu"),
        "category": meta.get("category"),
        "confidence": round(confidence, 4),
        "needsRepeat": needs_repeat,
        "alternatives": alternatives,
        "modelVersion": "psl-benchmark-lstm-v1"
    }
