export interface Prediction {
  status: string;
  label: string;
  englishText: string;
  urduText?: string;
  category?: string;
  confidence: number;
  needsRepeat: boolean;
  modelVersion: string;
  alternatives?: Array<{
    label: string;
    confidence: number;
    englishText: string;
  }>;
  message?: string;
}

export interface BackendHealth {
  status: string;
  service: string;
  aiServiceReady?: boolean;
}

// Configurable endpoints: supports localhost in development & Back4App/custom cloud URLs in production
const BACKEND_BASE = ((import.meta as any).env?.VITE_BACKEND_URL as string) || 'http://localhost:5000';
const AI_DIRECT_BASE = ((import.meta as any).env?.VITE_AI_URL as string) || 'http://127.0.0.1:8001';

export async function checkBackendStatus(): Promise<{ backend: boolean; aiService: boolean }> {
  let backend = false;
  let aiService = false;

  // 1. Check .NET Backend Gateway first
  try {
    const res = await fetch(`${BACKEND_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      backend = true;
      const data = await res.json();
      if (data.aiServiceReady === true) {
        aiService = true;
      }
    }
  } catch {
    backend = false;
  }

  // 2. Direct probe AI Service as robust fallback
  if (!aiService) {
    try {
      const res = await fetch(`${AI_DIRECT_BASE}/ready`, { method: 'GET', signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        aiService = data.ready === true;
      }
    } catch {
      aiService = false;
    }
  }

  return { backend, aiService };
}

export async function predictVideo(blob: Blob): Promise<Prediction> {
  const form = new FormData();
  form.append('video', blob, 'sign_clip.webm');

  let res: Response | null = null;
  let lastErr = '';

  // Try direct AI Service first for ultra-fast response, then fallback to .NET API proxy
  try {
    res = await fetch(`${AI_DIRECT_BASE}/v1/signs/predict-video`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(15000)
    });
  } catch (err: any) {
    lastErr = err.message || '';
  }

  if (!res || !res.ok) {
    try {
      res = await fetch(`${BACKEND_BASE}/api/v1/signs/predict-video`, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(15000)
      });
    } catch (err: any) {
      lastErr = err.message || lastErr;
    }
  }

  if (!res || !res.ok) {
    let message = 'Could not process sign clip. Please check service connection.';
    if (res) {
      try {
        const errJson = await res.json();
        message = errJson.detail || errJson.message || message;
      } catch {
        // ignore
      }
    } else if (lastErr) {
      message = lastErr;
    }
    throw new Error(message);
  }

  return res.json();
}
