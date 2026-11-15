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
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return harden(new Response(null, { headers: CORS }));
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
