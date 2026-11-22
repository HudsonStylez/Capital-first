import { saveImage } from './imageStore';

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || '';

export interface UploadResult {
  url?: string;
  key?: string;
}

/**
 * Uploads an image for cross-device access.
 * 1) Try the Worker/R2 (`/api/upload`) → returns a shared URL.
 * 2) Fall back to IndexedDB (local only) → returns a local key.
 */
export async function uploadImage(dataUrl: string): Promise<UploadResult> {
  try {
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl }),
    });
    if (res.ok) {
      const j = await res.json();
      if (j && j.url) return { url: j.url, key: j.key };
    }
  } catch {
    /* fall through to local */
  }
  try {
    const key = await saveImage(dataUrl);
    return { key };
  } catch {
    /* ignore */
  }
  return {};
}