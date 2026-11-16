// Vercel serverless function: POST /api/send-receipt
// Emails the official Capital One statement-style receipt.
// Uses SendGrid (primary) → Mailgun (fallback) → logged mock.
//
// Set these in Vercel → Project → Settings → Environment Variables:
//   SENDGRID_API_KEY            (or)
//   MAILGUN_API_KEY + MAILGUN_DOMAIN
//   EMAIL_FROM                  (optional, e.g. "Capital One <no-reply@yourdomain.com>")

import { buildReceiptHTML } from '../src/lib/receiptTemplate.js';

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

function extractEmail(from) {
  const m = /<([^>]+)>/.exec(from || '');
  return m ? m[1] : from;
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
      const auth = Buffer.from(`api:${env.MAILGUN_API_KEY}`).toString('base64');
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { to, subject, holderName, transaction, account, receiptData } = body;

    if (!to || !transaction) {
      res.status(400).json({ error: 'Missing required fields: to, transaction' });
      return;
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

    const result = await sendEmail(process.env, to, subj, html, text);
    res.status(200).json({ success: true, messageId: result.id, provider: result.provider, status: 'sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: String(error?.message || error) });
  }
}
