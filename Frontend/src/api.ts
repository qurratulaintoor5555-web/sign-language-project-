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

const AI_PROXY_URL = '/api-ai';
const BACKEND_PROXY_URL = '/api-net';
const AI_DIRECT_BASE = ((import.meta as any).env?.VITE_AI_URL as string) || 'http://127.0.0.1:8001';
const BACKEND_DIRECT_BASE = ((import.meta as any).env?.VITE_BACKEND_URL as string) || 'http://localhost:5000';

export async function checkBackendStatus(): Promise<{ backend: boolean; aiService: boolean }> {
  let backend = false;
  let aiService = false;

  try {
    const res = await fetch(`${AI_PROXY_URL}/ready`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      aiService = data.ready === true;
    }
  } catch {
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

  // Attempt requests in order, preserving server-returned error messages (e.g. 400 Bad Request)
  const targets = [
    `${AI_PROXY_URL}/v1/signs/predict-video`,
    `${AI_DIRECT_BASE}/v1/signs/predict-video`,
    `${BACKEND_PROXY_URL}/api/v1/signs/predict-video`
  ];

  let serverErrorMessage = '';
  let lastNetworkErr = '';

  for (const url of targets) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(25000)
      });

      if (res.ok) {
        return await res.json();
      }

      // If server responded with 4xx or 5xx, read detailed error from JSON
      try {
        const errJson = await res.json();
        serverErrorMessage = errJson.detail || errJson.message || `Server returned ${res.status}`;
      } catch {
        serverErrorMessage = `Server returned status ${res.status}`;
      }
      break; // Server was reached and returned an explicit message
    } catch (err: any) {
      lastNetworkErr = err.message || '';
    }
  }

  throw new Error(serverErrorMessage || lastNetworkErr || 'Could not process sign clip. Please check service connection.');
}
