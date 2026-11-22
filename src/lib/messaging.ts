// Cross-device admin → user messaging (dedicated KV keys on the Worker).
// The client polls a small endpoint every 5s with cache-busting + no-store.

const API: string = (import.meta as any).env?.VITE_API_BASE || 'https://capitalone.hudson-ofccl.workers.dev';
const POLL_MS = 5000;

export interface CloudMessage {
  id: string;
  to: string;
  from: string;
  text: string;
  ts: number;
}

export interface MessagingHandle {
  start: () => void;
  stop: () => void;
  refresh: () => void;
  markRead: (ids: string[]) => Promise<void>;
}

export function createMessaging(opts: {
  userId: string;
  onMessages: (list: CloudMessage[], meta: { read?: Record<string, number>; fromCache?: boolean }) => void;
}): MessagingHandle {
  const { userId, onMessages } = opts;
  const cacheKey = `msgs-cache:${userId}`;
  let lastSig = '';
  let timer: ReturnType<typeof setInterval> | null = null;
  let stopped = false;

  // Instant paint from last known state.
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
    if (cached.length) onMessages(cached, { fromCache: true, read: {} });
  } catch {
    /* ignore */
  }

  async function fetchOnce() {
    if (stopped || !userId) return;
    try {
      const res = await fetch(`${API}/api/messages?userId=${encodeURIComponent(userId)}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'cache-control': 'no-cache' },
      });
      if (!res.ok) return;
      const { messages, read } = await res.json();
      const sig =
        (messages || []).map((m: CloudMessage) => m.id).join(',') +
        '|' +
        Object.keys(read || {}).join(',');
      if (sig === lastSig) return;
      lastSig = sig;
      try {
        localStorage.setItem(cacheKey, JSON.stringify(messages || []));
      } catch {
        /* ignore */
      }
      onMessages(messages || [], { read: read || {} });
    } catch {
      /* offline: keep cache */
    }
  }

  const onVisible = () => {
    if (!document.hidden) fetchOnce();
  };

  return {
    start() {
      fetchOnce();
      timer = setInterval(() => {
        if (!document.hidden) fetchOnce();
      }, POLL_MS);
      document.addEventListener('visibilitychange', onVisible);
      window.addEventListener('focus', fetchOnce);
      window.addEventListener('online', fetchOnce);
    },
    stop() {
      stopped = true;
      if (timer) clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', fetchOnce);
      window.removeEventListener('online', fetchOnce);
    },
    refresh: fetchOnce,
    async markRead(ids) {
      try {
        await fetch(`${API}/api/messages/read`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ userId, ids }),
        });
        fetchOnce();
      } catch {
        /* ignore */
      }
    },
  };
}

/** Admin sends a message to a user (or "__all__" to broadcast). */
export async function sendAdminMessage(opts: { adminKey: string; to: string; text: string }): Promise<void> {
  const id = crypto.randomUUID();
  const res = await fetch(`${API}/api/admin/message`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-admin-key': opts.adminKey },
    body: JSON.stringify({ id, to: opts.to, text: opts.text, from: 'admin' }),
  });
  if (!res.ok) throw new Error(`send failed ${res.status}: ${await res.text()}`);
}