import { APP_KEY } from './keys';

const API: string = (import.meta as any).env?.VITE_API_BASE || 'https://capitalone.hudson-ofccl.workers.dev';

/** Fire-and-forget email notification (uses the Worker's email provider). */
export async function sendEmail(to?: string, subject = 'Capital One', text = ''): Promise<void> {
  if (!to || !to.includes('@') || !text.trim()) return;
  try {
    await fetch(`${API}/api/notify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-app-key': APP_KEY },
      body: JSON.stringify({ to, subject, text }),
    });
  } catch {
    /* offline — ignore */
  }
}