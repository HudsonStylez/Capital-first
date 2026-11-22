// Cloudflare Worker for the Capital One app.
// - Serves the built frontend (ASSETS binding)
// - POST /api/send-receipt → emails the official statement-style receipt
//   via SendGrid (primary) or Mailgun (fallback). Falls back to a logged
//   mock (still returns success) until provider secrets are configured.
//
// Configure secrets:
//   npx wrangler secret put SENDGRID_API_KEY
//   npx wrangler secret put MAILGUN_API_KEY
//   npx wrangler secret put MAILGUN_DOMAIN
//   npx wrangler secret put EMAIL_FROM   (optional, e.g. "Capital One <no-reply@yourdomain.com>")

import { buildReceiptHTML } from '../src/lib/receiptTemplate.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-app-key, x-admin-key',
};

// Must match src/lib/keys.ts. Stops anonymous scraping of the API.
const APP_KEY = 'cf-app-7f3a9c2e1b5d4a8';

// Security / trust headers applied to every response. These are the standard
// signals browsers, scanners, and reviewers look for on a trustworthy site.
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), microphone=(), geolocation=(self), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-src 'self' data: blob:",
    "object-src 'none'",
  ].join('; '),
};

function harden(res) {
  const headers = new Headers(res.headers);
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => {
    if (!headers.has(k)) headers.set(k, v);
  });
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

function json(obj, status = 200) {
  return harden(
    new Response(JSON.stringify(obj), {
      status,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  );
}

function plainText(holderName, t, acct) {
  return `Capital One — Official Transaction Receipt
============================================

Account Holder: ${holderName}
Account: ${acct?.accountName || ''} Ending in ${acct?.last4 || ''}
Reference #: ${t?.referenceNumber || ''}

Merchant/Description: ${t?.merchant || ''}
Type: ${t?.type || ''}
Status: ${t?.status || ''}
Category: ${t?.category || ''}
Amount: ${t?.amount != null ? Number(t.amount).toFixed(2) : ''}
Date: ${t?.date ? new Date(t.date).toLocaleString('en-US') : ''}
${t?.destinationDetails ? `Details: ${t.destinationDetails}\n` : ''}${t?.adminFeedback ? `Administrative Note: ${t.adminFeedback}\n` : ''}
Capital One, N.A. Member FDIC. Equal Housing Lender.
Routing (ABA) 051405515
Questions? capitalone.com or 1-877-383-4802.

Need help or believe this transaction is incorrect? Contact our support team
from the Capital One app (Support → Chat) or email support@capitalone.com
quoting reference ${t?.referenceNumber || ''}. Human support is available 24/7.
`;
}

async function sendEmail(env, to, subject, html, text) {
  const from = env.EMAIL_FROM || 'Capital One <no-reply@capitalone.com>';

  if (env.SENDGRID_API_KEY) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: extractEmail(from), name: 'Capital One' },
          subject,
          content: [
            { type: 'text/plain', value: text },
            { type: 'text/html', value: html },
          ],
        }),
      });
      if (res.status >= 200 && res.status < 300) {
        return { provider: 'sendgrid', id: res.headers.get('x-message-id') || `sendgrid-${Date.now()}` };
      }
      console.warn('SendGrid error', res.status, await res.text().catch(() => ''));
    } catch (e) {
      console.warn('SendGrid exception', e?.message || e);
    }
  }

  if (env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN) {
    try {
      const auth = btoa(`api:${env.MAILGUN_API_KEY}`);
      const res = await fetch(`https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ from, to, subject, html, text }),
      });
      if (res.status >= 200 && res.status < 300) {
        const data = await res.json().catch(() => ({}));
        return { provider: 'mailgun', id: data.id || `mailgun-${Date.now()}` };
      }
      console.warn('Mailgun error', res.status, await res.text().catch(() => ''));
    } catch (e) {
      console.warn('Mailgun exception', e?.message || e);
    }
  }

  console.log('📧 [MOCK EMAIL] to=%s subject=%s', to, subject);
  return { provider: 'mock', id: `mock-${Date.now()}` };
}

function extractEmail(from) {
  const m = /<([^>]+)>/.exec(from || '');
  return m ? m[1] : from;
}

// ===== messaging (dedicated KV keys; never touched by the state writer) =====
function mjson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store, no-cache, must-revalidate',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type, x-admin-key',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
    },
  });
}

async function getMessages(url, env) {
  const userId = (url.searchParams.get('userId') || '').trim();
  if (!userId) return mjson({ error: 'userId required' }, 400);

  const [mineRaw, allRaw, readRaw] = await Promise.all([
    env.BANKING_KV.get(`msgs:${userId}`),
    env.BANKING_KV.get('msgs:__all__'),
    env.BANKING_KV.get(`read:${userId}`),
  ]);
  const mine = mineRaw ? JSON.parse(mineRaw) : [];
  const all = allRaw ? JSON.parse(allRaw) : [];
  const read = readRaw ? JSON.parse(readRaw) : {};

  const messages = [...all, ...mine].sort((a, b) => a.ts - b.ts);
  return mjson({ messages, read });
}

async function appendMessage(env, key, msg) {
  for (let i = 0; i < 3; i++) {
    const raw = await env.BANKING_KV.get(key);
    const list = raw ? JSON.parse(raw) : [];
    if (list.some((m) => m.id === msg.id)) return list; // idempotent retry
    list.push(msg);
    await env.BANKING_KV.put(key, JSON.stringify(list.slice(-200)));
    const check = await env.BANKING_KV.get(key);
    if (check && JSON.parse(check).some((m) => m.id === msg.id)) return JSON.parse(check);
    await new Promise((r) => setTimeout(r, 60 * (i + 1)));
  }
  return null;
}

async function postAdminMessage(request, env) {
  const key = request.headers.get('x-admin-key') || '';
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) return mjson({ error: 'unauthorized' }, 401);

  const body = await request.json().catch(() => null);
  const to = (body?.to || '').trim(); // username, or "__all__" for broadcast
  const text = (body?.text || '').trim();
  if (!to || !text) return mjson({ error: 'to and text required' }, 400);
  if (text.length > 4000) return mjson({ error: 'too long' }, 413);

  const msg = {
    id: body.id || crypto.randomUUID(), // client-supplied id => safe retries
    to,
    from: body.from || 'admin',
    text,
    ts: Date.now(),
  };

  const saved = await appendMessage(env, `msgs:${to}`, msg);
  if (!saved) return mjson({ error: 'write not confirmed, retry with same id' }, 502);
  return mjson({ ok: true, message: msg });
}

async function postRead(request, env) {
  const body = await request.json().catch(() => null);
  const userId = (body?.userId || '').trim();
  const ids = Array.isArray(body?.ids) ? body.ids : [];
  if (!userId) return mjson({ error: 'userId required' }, 400);

  const k = `read:${userId}`;
  const raw = await env.BANKING_KV.get(k);
  const read = raw ? JSON.parse(raw) : {};
  let changed = false;
  for (const id of ids) {
    if (!read[id]) {
      read[id] = Date.now();
      changed = true;
    }
  }
  if (changed) {
    const entries = Object.entries(read)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 500);
    await env.BANKING_KV.put(k, JSON.stringify(Object.fromEntries(entries)));
  }
  return mjson({ ok: true, read });
}
// ===== end messaging =====

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return harden(new Response(null, { headers: CORS }));
    }

    // --- messaging routes (dedicated KV keys; never the state blob) ---
    if (url.pathname === '/api/messages' && request.method === 'GET') {
      if (request.headers.get('x-app-key') !== APP_KEY) return mjson({ error: 'unauthorized' }, 401);
      if (!env.BANKING_KV) return mjson({ error: 'KV not configured' }, 503);
      return getMessages(url, env);
    }
    if (url.pathname === '/api/messages/read' && request.method === 'POST') {
      if (request.headers.get('x-app-key') !== APP_KEY) return mjson({ error: 'unauthorized' }, 401);
      if (!env.BANKING_KV) return mjson({ error: 'KV not configured' }, 503);
      return postRead(request, env);
    }
    if (url.pathname === '/api/admin/message' && request.method === 'POST') {
      if (!env.BANKING_KV) return mjson({ error: 'KV not configured' }, 503);
      return postAdminMessage(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        email: env.SENDGRID_API_KEY
          ? 'sendgrid'
          : env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN
          ? 'mailgun'
          : 'mock',
      });
    }

    if (request.method === 'POST' && url.pathname === '/api/send-receipt') {
      try {
        const body = await request.json();
        const { to, subject, holderName, transaction, account, receiptData } = body || {};
        if (!to || !transaction) {
          return json({ error: 'Missing required fields: to, transaction' }, 400);
        }

        const acct = account || {};
        const data =
          receiptData || {
            holderName: holderName || 'Capital One Customer',
            transaction,
            account: {
              accountName: acct.accountName || (acct.type === 'credit' ? 'Capital One Platinum Mastercard' : '360 Checking'),
              accountType: acct.type,
              last4: (acct.accountNumber || '').slice(-4) || '0000',
              swiftCode: acct.swiftCode,
            },
            balances: {
              before: acct.balanceBefore ?? transaction.amount,
              after: acct.balanceAfter ?? transaction.amount,
              creditLimit: acct.creditLimit,
              availableCredit: acct.availableCredit,
            },
          };

        const html = buildReceiptHTML(data);
        const text = plainText(data.holderName, data.transaction, data.account);
        const subj = subject || `Capital One Receipt — REF-${transaction.referenceNumber}`;

        const result = await sendEmail(env, to, subj, html, text);
        return json({ success: true, messageId: result.id, provider: result.provider, status: 'sent' });
      } catch (error) {
        return json({ error: 'Failed to send email', details: String(error?.message || error) }, 500);
      }
    }

    // --- Image upload (R2) + serving ---
    if (url.pathname === '/api/upload' && request.method === 'POST') {
      if (request.headers.get('x-app-key') !== APP_KEY) return json({ error: 'unauthorized' }, 401);
      if (!env.UPLOADS) {
        return json({ synced: false, error: 'Image storage not configured (UPLOADS/R2 missing)' }, 503);
      }
      try {
        const body = await request.json();
        const dataUrl = body?.dataUrl;
        if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
          return json({ error: 'Invalid image data' }, 400);
        }
        const comma = dataUrl.indexOf(',');
        const meta = dataUrl.slice(0, comma);
        const b64 = dataUrl.slice(comma + 1);
        const mime = (/data:([^;]+)/.exec(meta)?.[1] || 'image/jpeg').trim();
        const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
        const key = `img/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
        await env.UPLOADS.put(key, bytes, { httpMetadata: { contentType: mime } });
        const imgUrl = new URL(`/api/image/${key}`, request.url);
        imgUrl.searchParams.set('k', APP_KEY);
        return json({ success: true, key, url: imgUrl.toString() });
      } catch (error) {
        return json({ error: 'Upload failed', details: String(error?.message || error) }, 500);
      }
    }

    if (url.pathname.startsWith('/api/image/') && request.method === 'GET') {
      const okKey = url.searchParams.get('k') === APP_KEY || request.headers.get('x-app-key') === APP_KEY;
      if (!okKey) return json({ error: 'unauthorized' }, 401);
      if (!env.UPLOADS) return json({ error: 'Image storage not configured' }, 503);
      const key = decodeURIComponent(url.pathname.slice('/api/image/'.length));
      const obj = await env.UPLOADS.get(key);
      if (!obj) return json({ error: 'Not found' }, 404);
      const headers = new Headers(CORS);
      obj.writeHttpMetadata(headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return new Response(obj.body, { headers });
    }

    // --- Shared banking state (cloud sync across devices) ---
    // Requires a KV namespace bound as BANKING_KV (see wrangler.toml).
    if (url.pathname === '/api/state') {
      if (request.headers.get('x-app-key') !== APP_KEY) return json({ error: 'unauthorized' }, 401);
      if (!env.BANKING_KV) {
        return json({ synced: false, error: 'Cloud sync not configured (BANKING_KV missing)' }, 503);
      }
      if (request.method === 'GET') {
        const raw = await env.BANKING_KV.get('banking:state', 'json');
        return json({ synced: true, updatedAt: raw?.updatedAt || 0, data: raw?.data || null });
      }
      if (request.method === 'PUT') {
        try {
          const body = await request.json();
          const updatedAt = Date.now();
          const payload = JSON.stringify({ updatedAt, data: body?.data ?? null });
          await env.BANKING_KV.put('banking:state', payload);
          return json({ synced: true, success: true, updatedAt });
        } catch (error) {
          return json({ synced: false, error: 'Failed to save state', details: String(error?.message || error) }, 500);
        }
      }
      return json({ error: 'Method not allowed' }, 405);
    }

    // Serve static frontend assets (hardened with security headers)
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return harden(response);
      }
      const indexResponse = await env.ASSETS.fetch(new URL('/index.html', request.url));
      if (indexResponse.status === 200) {
        return harden(indexResponse);
      }
    }

    return json({ error: 'Not found' }, 404);
  },
};
