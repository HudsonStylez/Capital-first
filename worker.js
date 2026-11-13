// Cloudflare Workers Email Backend for Capital One Clone
// Uses SendGrid HTTP API or Mailgun HTTP API (no nodemailer needed)
// Deploys to: npx wrangler deploy

// =============================================================================
// Email Templates (same as server.js)
// =============================================================================

function toCurrency(amount) {
  return Math.abs(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function generateReceiptEmailHTML(transaction, account) {
  const { id, referenceNumber, merchant, type, status, amount, date } = transaction;
  const { type: accType, accountNumber, balanceBefore, balanceAfter } = account;
  const formattedAmount = toCurrency(amount);
  const maskedAccount = `•••• ${accountNumber.slice(-4)}`;
  const typeLabels = {
    Deposit: 'Direct Deposit',
    Withdrawal: 'ATM Cash Withdrawal',
    Payment: 'Bill Payment',
    Transfer: 'Internal Transfer',
  };
  const typeLabel = typeLabels[type] || type;
  const statusColor = status === 'Completed' ? 'text-emerald-600' : status === 'Pending' ? 'text-amber-600' : 'text-red-600';

  const bgColor = {
    Deposit: '#EBF8F5',
    Withdrawal: '#FEE2E2',
    Payment: '#EFF8FF',
    Transfer: '#F0F9FF',
  }[type] || '#F3F4F6';

  return `
<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: ${bgColor}; padding: 30px; border-radius: 8px; margin: -30px -30px 20px;">
    <h1 style="color: #005C9D; font-size: 24px; margin: 0; margin-bottom: 10px;">Capital One Transaction Receipt</h1>
    <p style="color: #666; font-size: 14px; margin: 0;">
      Reference: REF-#${referenceNumber}
    </p>
  </div>

  <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
    <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Dear Customer,</p>

    <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 6px;">
      <p style="margin: 0 0 10px 0; color: #333; font-size: 15px;">
        <strong>Transaction Details</strong>
      </p>
      <ul style="margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Merchant:</span> ${merchant}
        </li>
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Type:</span> ${typeLabel}
        </li>
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Status:</span>
          <span style="color: ${statusColor}; font-weight: 600;">${status}</span>
        </li>
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Amount:</span> ${formattedAmount}
        </li>
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Date:</span> ${new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </li>
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Reference #:</span> ${referenceNumber}
        </li>
      </ul>
    </div>

    <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 6px;">
      <p style="margin: 0 0 10px 0; color: #333; font-size: 15px;">
        <strong>Account Summary</strong>
      </p>
      <ul style="margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Account Type:</span> ${accType === 'checking' ? '360 Checking' : 'Quicksilver Rewards'}
        </li>
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Account #:</span> ${maskedAccount}
        </li>
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Balance Before:</span> ${balanceBefore.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </li>
        <li style="margin-bottom: 8px; color: #444;">
          <span style="font-weight: 600;">Balance After:</span> ${balanceAfter.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </li>
      </ul>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #666; font-size: 14px; margin: 0;">
        This is an electronic record of your transaction. Please retain for your personal accounting.
      </p>
      <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
        Questions? Visit capitalone.com or call 1-877-383-4802.
      </p>
    </div>
  </div>

  <div style="margin-top: 20px; padding: 20px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #666;">
    <p style="margin: 0 0 10px 0;">Capital One, N.A. Member FDIC. Equal Housing Lender.</p>
    <p style="margin: 0;">This receipt is an electronic record of your transaction and may be used for your records.</p>
  </div>
</div>`;
}

function generateReceiptEmailText(transaction, account) {
  const { id, referenceNumber, merchant, type, status, amount, date } = transaction;
  const { type: accType, accountNumber, balanceBefore, balanceAfter } = account;
  const formattedAmount = toCurrency(amount);
  const maskedAccount = `•••• ${accountNumber.slice(-4)}`;
  const typeLabels = {
    Deposit: 'Direct Deposit',
    Withdrawal: 'ATM Cash Withdrawal',
    Payment: 'Bill Payment',
    Transfer: 'Internal Transfer',
  };
  const typeLabel = typeLabels[type] || type;

  return `Capital One Transaction Receipt
================================

Reference: REF-${referenceNumber}

Transaction Details:
- Merchant: ${merchant}
- Type: ${typeLabel}
- Status: ${status}
- Amount: ${formattedAmount}
- Date: ${new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
- Reference #: ${referenceNumber}

Account Summary:
- Account Type: ${accType === 'checking' ? '360 Checking' : 'Quicksilver Rewards'}
- Account #: ${maskedAccount}
- Balance Before: $${balanceBefore.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })}
- Balance After: $${balanceAfter.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })}

This is an electronic record of your transaction. Please retain for your personal accounting.

Questions? Visit capitalone.com or call 1-877-383-4802.

Capital One, N.A. Member FDIC. Equal Housing Lender.
`;
}

// =============================================================================
// Email Sending Functions
// =============================================================================

async function sendViaSendGrid(env, to, subject, html, text) {
  const apiKey = env.SENDGRID_API_KEY;
  if (!apiKey) return null;

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'no-reply@capitalone.com', name: 'Capital One' },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
    }),
  });

  if (res.status >= 200 && res.status < 300) {
    const data = await res.json();
    return data.headers?.['x-message-id'] || 'sendgrid-' + Date.now();
  }
  console.error('SendGrid error:', res.status, await res.text());
  return null;
}

async function sendViaMailgun(env, to, subject, html, text) {
  const apiKey = env.MAILGUN_API_KEY;
  const domain = env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) return null;

  const auth = btoa(`api:${apiKey}`);
  const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      from: 'Capital One <no-reply@capitalone.com>',
      to,
      subject,
      html,
      text,
    }),
  });

  if (res.status >= 200 && res.status < 300) {
    const data = await res.json();
    return data.id || 'mailgun-' + Date.now();
  }
  console.error('Mailgun error:', res.status, await res.text());
  return null;
}

// =============================================================================
// Main Handler
// =============================================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS for local development
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Send receipt email
    if (request.method === 'POST' && url.pathname === '/api/send-receipt') {
      try {
        const body = await request.json();
        const { to, subject, transaction, account } = body;

        if (!to || !subject || !transaction || !account) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }

        const html = generateReceiptEmailHTML(transaction, account);
        const text = generateReceiptEmailText(transaction, account);

        let messageId = null;

        // Try SendGrid
        messageId = await sendViaSendGrid(env, to, subject, html, text);

        // Try Mailgun if SendGrid not configured or failed
        if (!messageId) {
          messageId = await sendViaMailgun(env, to, subject, html, text);
        }

        // Mock mode if no email API configured
        if (!messageId) {
          console.log('📧 [MOCK EMAIL] Would send to:', to);
          console.log('📧 [MOCK EMAIL] Subject:', subject);
          messageId = 'mock-' + Date.now();
        }

        return new Response(
          JSON.stringify({
            success: true,
            messageId,
            status: 'sent',
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      } catch (error) {
        console.error('❌ Email send error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to send email', details: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Not found for other /api/* routes
    if (url.pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // For any other path, Cloudflare Pages serves the SPA
    // This worker handles /api/* and /health only
    return new Response(null, { status: 404 });
  },
};