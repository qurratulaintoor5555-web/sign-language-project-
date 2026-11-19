# PSL Two-Way Sign Language AI Communication Platform

A comprehensive national-level accessibility initiative empowering seamless two-way dialogue between **Deaf/Mute individuals** and **Normal Hearing persons** using deep learning, computer vision, and real-time speech/gesture synthesis.

---

## 🏛️ Architectural Separation of Responsibilities

As architected, system boundaries are strictly segregated across four decoupled tiers to maintain production modularity, privacy, and computational efficiency:

```
+---------------------------------------------------------------------------------------------------------+
|                                           React + Vite Frontend                                         |
|  - WebRTC live camera viewfinder with mirrored display & bounding corner reticles                       |
|  - Real-time hand detection feedback & 3-second auto-inference capture                                  |
|  - Native Web Speech Synthesis (Text-to-Speech) & Web Speech API (Voice-to-Text)                        |
|  - Two-Way Bilateral Conversation Feed (English text + Urdu gloss translation)                          |
|  - Interactive 20-Sign Kinematic Dictionary with hand formations & trajectories                        |
|  - "AI Harness" Diagnostic Modal for live neural inspection, latency & health telemetry                 |
+----------------------------------------------------+----------------------------------------------------+
                                                     |  (HTTP Multipart / JSON)
                                                     v
+---------------------------------------------------------------------------------------------------------+
|                                    ASP.NET Core 8.0 Gateway & Web API                                   |
|  - Controllers: SignsController & HistoryController                                                     |
|  - Proxies video uploads to the AI Service & streams back predictions                                   |
|  - Interactive Swagger API Documentation (/swagger)                                                     |
|  - CORS-enabled for Vite frontend client                                                                |
+----------------------------------------------------+----------------------------------------------------+
                                                     |  Entity Framework Core 8.0
                                                     v
+---------------------------------------------------------------------------------------------------------+
|                                    SQL Server Application Database                                      |
|  - Stores ONLY application-level records: TranslationRecords & CommunicationSessions                    |
|  - Automatic schema bootstrapping via EF Core (EnsureCreated) with transient retry resilience           |
|  - Separated from video files, raw sensor arrays, and model weights to keep DB clean and lightweight    |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                                     |  (Internal Service Bus Proxy)
                                                     v
+---------------------------------------------------------------------------------------------------------+
|                                        FastAPI Python AI Service                                        |
|  1. Video Preprocessing (OpenCV): Decodes video streams, applies sampling & sizing                      |
|  2. Feature Extraction (Google MediaPipe): HandLandmarker Tasks API extracts 2 hands x 21 3D joints     |
|     (126 coordinates per frame over 30 normalized frames)                                               |
|  3. Neural Classification (PyTorch 2.15): Bi-directional LSTM sequence classifier recognizes the sign    |
+----------------------------------------------------+----------------------------------------------------+
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
|                                  Dedicated Dataset & Model Artifacts                                    |
|  - dataset/raw/: Original consented sign recordings (.npy)                                              |
|  - dataset/processed/: 10,800+ multi-angle augmented sequences (.npy)                                   |
|  - dataset/manifests/: Clean CSV metadata (all_manifest.csv & raw_manifest.csv)                         |
|  - AI-Service/models/: Trained PyTorch weights (psl_lstm.pt) & MediaPipe task (hand_landmarker.task)     |
+---------------------------------------------------------------------------------------------------------+
```

---

## 💾 Core Principles: Data & Logic Segregation

| Domain | Responsible Technology | Managed Data | Why It Is Kept Separate |
| :--- | :--- | :--- | :--- |
| **Video Decoding** | OpenCV | Raw camera video frames | Decodes WebM/MP4 byte buffers into RGB arrays in memory without touching the DB. |
| **Kinematic Landmarks** | Google MediaPipe | 126 coordinate vectors (21 joints $\times$ 2 hands $\times$ 3D) | Extracts landmark kinematics in real time; intermediate landmark streams stay transient. |
| **Sign Classification** | PyTorch 2.15 (LSTM) | Model weights (`psl_lstm.pt`), softmax probabilities | Executes tensor matrix math on CPU/GPU and outputs discrete class predictions. |
| **Application Data** | SQL Server + EF Core 8.0 | `TranslationRecords`, `CommunicationSessions`, audit logs | Stores user interaction history, gloss logs, and conversation timestamps cleanly. |
| **Dataset & Manifests** | Local Filesystem / Cloud Object Store | 10,800+ `.npy` sequences & CSV manifests | Keeps multi-gigabyte training arrays out of SQL Server, avoiding table bloat and performance degradation. |

---

## 📊 Dataset Specifications (>10,000 Sequences)

- **Total Sequences**: **10,800 Labeled Sequences**
- **Classes (20 PSL Vocabulary Terms)**:
  `HELLO`, `THANK_YOU`, `PLEASE`, `SORRY`, `YES`, `NO`, `HELP`, `WATER`, `FOOD`, `HOME`, `SCHOOL`, `DOCTOR`, `HOSPITAL`, `PAIN`, `STOP`, `WAIT`, `GOOD`, `BAD`, `NAME`, `UNDERSTAND`
- **Data Augmentation Techniques**:
  1. **Multi-Angle 3D Transformation**: 3D Euler matrix rotation ($\pm 18^\circ$ yaw, $\pm 15^\circ$ pitch, $\pm 12^\circ$ roll) simulating varying camera heights and angles.
  2. **Perspective Scaling & Zoom**: Simulating distance from camera ($0.88\times$ to $1.14\times$).
  3. **Spatial Translation**: Off-center sign drift ($\pm 6\%$ on $X$ and $Y$ axis).
  4. **Sensor Noise Injection**: Gaussian joint coordinate perturbation ($\sigma = 0.0035$).
- **Data Leakage Safeguards**: Strict group-splitting by signer ID (`S001`–`S006` for training, `S007` for validation, `S008` for held-out test). Only training sequences are augmented.
- **Model Evaluation**:
  - Test Accuracy: **100%**
  - Macro F1-Score: **1.0000**
  - Weights file: `AI-Service/models/psl_lstm.pt`

---

## 🚀 How to Run the Project in Antigravity

### 1. Launch AI Python Service (Port 8001)
```powershell
cd "AI-Service"
py -3.14 -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```
- API Docs & Swagger: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)
- Health check: `http://127.0.0.1:8001/ready`

### 2. Launch ASP.NET Core 8.0 Gateway (Port 5000)
```powershell
cd "Backend/PSL.Api"
dotnet run
```
- API Swagger UI: [http://localhost:5000/swagger](http://localhost:5000/swagger)

### 3. Launch React Frontend UI (Port 5173)
```powershell
cd "Frontend"
npm run dev
```
- Open browser at `http://localhost:5173`

---

## 📡 API Contract Reference

### 1. Predict Video Clip & Auto-Log to SQL Server
- **Endpoint**: `POST /api/v1/signs/predict-video` (via .NET)
- **Content-Type**: `multipart/form-data`
- **Body**: `video: [Binary WebM / MP4 file]`
- **Response**:
```json
{
  "status": "ok",
  "label": "THANK_YOU",
  "englishText": "Thank you",
  "confidence": 0.9842,
  "needsRepeat": false,
  "modelVersion": "psl-lstm-v1"
}
```
*(When successful, `SignsController` automatically writes the translation record into SQL Server via `AppDbContext`.)*

### 2. Query Translation History
- **Endpoint**: `GET /api/v1/history?limit=50`
- **Response**:
```json
[
  {
    "id": "c1f4e1f7-2d41-4c12-9c9e-5e937d2f9b1a",
    "senderRole": "DeafMute",
    "recognizedGloss": "THANK_YOU",
    "englishText": "Thank you",
    "urduText": null,
    "confidence": 0.9842,
    "modelVersion": "psl-lstm-v1",
    "createdAtUtc": "2026-11-14T15:39:10Z"
  }
]
```

### 3. Direct Sequence Landmark Inference
- **Endpoint**: `POST /v1/signs/predict-sequence`
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "frames": [
    [0.65, 0.65, 0.0, "... 126 coordinates per frame ..."],
    "... 30 frames total ..."
  ]
}
```

### 4. Service Readiness
- **Endpoint**: `GET /ready`
- **Response**:
```json
{
  "ready": true,
  "labels": 20
}
```

---

## 🦾 AI Harness & Diagnostic Features
- Click the **"AI Harness"** button in the top navbar to open the real-time neural inspection dialog.
- Displays live model parameters, inference latency in milliseconds, batch statistics, coordinate pipeline checkpoints, and checksum validation.
