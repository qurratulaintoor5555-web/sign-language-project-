# SignBridge AI — Back4App Deployment Guide

This guide walks you through deploying **SignBridge AI** to **Back4App Containers** (free / low-cost container hosting with automated GitHub continuous deployment).

---

## Architecture for Deployment

The project consists of 3 production container services:

| Component | Port | Dockerfile | Environment Variables |
|---|---|---|---|
| **AI Vision Service** (FastAPI, PyTorch, MediaPipe) | `8001` | `Dockerfile.ai` | `PORT=8001`, `PSL_CONFIDENCE_THRESHOLD=0.30` |
| **Backend Gateway** (.NET 8 Core Web API) | `5000` | `Dockerfile.backend` | `AIService__BaseUrl=https://<your-ai-app>.b4a.run/` |
| **Frontend UI** (React, Vite, Nginx) | `80` | `Dockerfile.frontend` | `VITE_AI_URL=https://<your-ai-app>.b4a.run` |

---

## Step-by-Step Back4App Deployment

### Step 1: Push Code to GitHub
Ensure all your files are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: add Docker and Back4App deployment configurations"
git push origin master
```

---

### Step 2: Deploy AI Recognition Service on Back4App
1. Go to [Back4App Containers Dashboard](https://www.back4app.com/).
2. Click **"Create New App"** -> Choose **"Containers as a Service (CaaS)"**.
3. Connect your **GitHub Repository**.
4. Configure the AI service:
   - **App Name**: `signbridge-ai-service`
   - **Branch**: `master` (or `main`)
   - **Root Directory**: leave blank `/`
   - **Dockerfile Path**: `Dockerfile.ai`
5. Under **Environment Variables**:
   - `PORT` = `8001`
   - `PSL_CONFIDENCE_THRESHOLD` = `0.30`
6. Click **Deploy**.
7. Once deployed, copy your public URL (e.g., `https://signbridge-ai-service-xxxx.b4a.run`).

---

### Step 3: Deploy .NET Backend (Optional / Gateway)
1. In Back4App, click **"Create New App"** -> **"Containers as a Service"**.
2. Select the same repository.
3. Configure settings:
   - **App Name**: `signbridge-backend`
   - **Dockerfile Path**: `Dockerfile.backend`
4. Under **Environment Variables**:
   - `AIService__BaseUrl` = `https://<YOUR_AI_SERVICE_URL>.b4a.run/`
   - `ASPNETCORE_URLS` = `http://+:5000`
5. Click **Deploy**.

---

### Step 4: Deploy Frontend Dashboard
1. In Back4App, click **"Create New App"** -> **"Containers as a Service"** (or deploy on Vercel / Netlify with 1 click).
2. Configure settings:
   - **App Name**: `signbridge-app`
   - **Dockerfile Path**: `Dockerfile.frontend`
3. Under **Environment Variables**:
   - `VITE_AI_URL` = `https://<YOUR_AI_SERVICE_URL>.b4a.run`
   - `VITE_BACKEND_URL` = `https://<YOUR_BACKEND_URL>.b4a.run`
4. Click **Deploy**.

Your live URL is now ready for public use!
