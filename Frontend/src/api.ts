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

// In local browser dev, route through Vite's local reverse proxies to avoid CORS/port blocks completely
const AI_PROXY_URL = '/api-ai';
const BACKEND_PROXY_URL = '/api-net';

// Direct URLs as secondary fallback
const AI_DIRECT_BASE = ((import.meta as any).env?.VITE_AI_URL as string) || 'http://127.0.0.1:8001';
const BACKEND_DIRECT_BASE = ((import.meta as any).env?.VITE_BACKEND_URL as string) || 'http://localhost:5000';

export async function checkBackendStatus(): Promise<{ backend: boolean; aiService: boolean }> {
  let backend = false;
  let aiService = false;

  // 1. Probe AI Service via local proxy first
  try {
    const res = await fetch(`${AI_PROXY_URL}/ready`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      aiService = data.ready === true;
    }
  } catch {
    // Try direct AI fallback
    try {
      const res = await fetch(`${AI_DIRECT_BASE}/ready`, { method: 'GET', signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        aiService = data.ready === true;
      }
    } catch {
      aiService = false;
    }
  }

  // 2. Probe .NET Gateway via local proxy
  try {
    const res = await fetch(`${BACKEND_PROXY_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      backend = true;
    }
  } catch {
    try {
      const res = await fetch(`${BACKEND_DIRECT_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        backend = true;
      }
    } catch {
      backend = false;
    }
  }

  return { backend, aiService };
}

export async function predictVideo(blob: Blob): Promise<Prediction> {
  const form = new FormData();
  form.append('video', blob, 'sign_clip.webm');

  let res: Response | null = null;
  let lastErr = '';

  // 1. Send via local Vite AI proxy (bypasses any browser CORS/port restrictions)
  try {
    res = await fetch(`${AI_PROXY_URL}/v1/signs/predict-video`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(20000)
    });
  } catch (err: any) {
    lastErr = err.message || '';
  }

  // 2. If proxy failed, try direct AI port
  if (!res || !res.ok) {
    try {
      res = await fetch(`${AI_DIRECT_BASE}/v1/signs/predict-video`, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(20000)
      });
    } catch (err: any) {
      lastErr = err.message || lastErr;
    }
  }

  // 3. If direct AI failed, try .NET backend proxy
  if (!res || !res.ok) {
    try {
      res = await fetch(`${BACKEND_PROXY_URL}/api/v1/signs/predict-video`, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(20000)
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
