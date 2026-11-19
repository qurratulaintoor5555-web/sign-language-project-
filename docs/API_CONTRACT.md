# API Contract

## Browser → ASP.NET Core

Base path: `/api/v1`

### POST `/signs/predict-video`
- Content-Type: `multipart/form-data`
- Field: `video` (WebM/MP4, maximum size configured by backend)
- Response:
```json
{
  "status": "ok",
  "label": "HELLO",
  "englishText": "Hello",
  "confidence": 0.91,
  "needsRepeat": false,
  "modelVersion": "psl-lstm-v1"
}
```
If model is missing: HTTP 503 with `{ "code": "model_not_ready", "message": "The PSL model has not been trained yet." }`.

### GET `/history`
Returns the current user's recent history once authentication is implemented. Starter returns an empty list unless persistence is enabled.

## ASP.NET Core → FastAPI

### GET `/health`
Service liveness.

### GET `/ready`
Returns whether model weights and label map are available.

### POST `/v1/signs/predict-video`
Multipart field `video`. Returns the prediction object above.

### POST `/v1/signs/predict-sequence`
JSON:
```json
{ "frames": [[0.0, 0.0], "... exactly 30 frames of 126 numeric features ..."] }
```
The actual request must contain a numeric array of shape `[30,126]`.

## English → PSL
Planned backend endpoint: `GET /api/v1/signs/media?gloss=HELLO`. It must return only a verified, licensed media asset from the curated PSL vocabulary table. No automatic literal word-to-sign conversion.
