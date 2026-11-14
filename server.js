import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { buildReceiptHTML } from './src/lib/receiptTemplate.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nodemailer transport configuration
// In production, configure with your email service (SendGrid, Mailgun, etc.)
let transporter;

try {
  // Try to use SendGrid if API key is provided
  if (process.env.SENDGRID_API_KEY) {
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      auth: {
        user: 'api',
        pass: process.env.MAILGUN_API_KEY,
      },
    });
  } else {
    // Mock transport for development - logs instead of sending
    transporter = {
      sendMail: async (data) => {
        console.log('📧 [MOCK EMAIL] Would send to:', data.to);
        console.log('📧 [MOCK EMAIL] Subject:', data.subject);
        console.log('📧 [MOCK EMAIL] Text:', data.text);
        console.log('📧 [MOCK EMAIL] HTML:', data.html);
        return { messageId: 'mock-' + Date.now() };
      },
    };
  }
} catch (error) {
  console.warn('⚠️ Email transport initialization error, using mock:', error.message);
  transporter = {
    sendMail: async (data) => {
      console.log('📧 [MOCK EMAIL] Would send to:', data.to);
      console.log('📧 [MOCK EMAIL] Subject:', data.subject);
      console.log('📧 [MOCK EMAIL] Text:', data.text);
      console.log('📧 [MOCK EMAIL] HTML:', data.html);
      return { messageId: 'mock-' + Date.now() };
    },
  };
}

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Send transaction receipt email endpoint
app.post('/api/send-receipt', async (req, res) => {
  try {
    const {
      to,
      subject,
      transaction,
      account,
      holderName,
      receiptData,
    } = req.body;

    if (!to || !subject || !transaction) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const acct = account || {};
    const data = receiptData || {
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

    // Send the email using the shared statement-style template
    const info = await transporter.sendMail({
      from: `Capital One <no-reply@capitalone.com>`,
      to,
      subject,
      html: buildReceiptHTML(data),
      text: generateReceiptEmailText(transaction, account || {}),
    });

    res.json({
      success: true,
      messageId: info.messageId,
      status: 'sent',
    });
  } catch (error) {
    console.error('❌ Email send error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Helper: Generate HTML email content
function generateReceiptEmailHTML(transaction, account) {
  const { id, referenceNumber, merchant, type, status, amount, date } = transaction;
  const { type: accType, accountNumber, balanceBefore, balanceAfter } = account;
  const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const maskedAccount = `•••• ${accountNumber.slice(-4)}`;
  const typeLabels = {
    Deposit: 'Direct Deposit',
    Withdrawal: 'ATM Cash Withdrawal',
    Payment: 'Bill Payment',
    Transfer: 'Internal Transfer',
  };
  const typeColor = {
    Deposit: 'text-emerald-600',
    Withdrawal: 'text-red-600',
    Payment: 'text-[#005C9D]',
    Transfer: 'text-sky-600',
  };

  const typeLabel = typeLabels[type] || type;
  const bgColor = {
    Deposit: '#EBF8F5',
    Withdrawal: '#FEE2E2',
    Payment: '#EFF8FF',
    Transfer: '#F0F9FF',
  }[type] || '#F3F4F6';

  const statusColor = status === 'Completed' ? 'text-emerald-600' : status === 'Pending' ? 'text-amber-600' : 'text-red-600';

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${bgColor}; padding: 30px; border-radius: 8px; margin: -30px -30px 20px;">
        <h1 style="color: #005C9D; font-size: 24px; margin: 0; margin-bottom: 10px;">Capital One Transaction Receipt</h1>
        <p style="color: #666; font-size: 14px; margin: 0;">
          Reference: REF-#{referenceNumber}
        </p>
      </div>

      <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
          Dear Customer,
        </p>

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
        <p style="margin: 0 0 10px 0;">
          Capital One, N.A. Member FDIC. Equal Housing Lender.
        </p>
        <p style="margin: 0;">
          This receipt is an electronic record of your transaction and may be used for your records.
        </p>
      </div>
    </div>
  `;
}

// Helper: Generate plain text email content
function generateReceiptEmailText(transaction, account) {
  const { id, referenceNumber, merchant, type, status, amount, date } = transaction;
  const { type: accType, accountNumber, balanceBefore, balanceAfter } = account;
  const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const maskedAccount = `•••• ${accountNumber.slice(-4)}`;
  const typeLabels = {
    Deposit: 'Direct Deposit',
    Withdrawal: 'ATM Cash Withdrawal',
    Payment: 'Bill Payment',
    Transfer: 'Internal Transfer',
  };

  const typeLabel = typeLabels[type] || type;

  return `
Capital One Transaction Receipt
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

// Start server
app.listen(PORT, () => {
  console.log(`📧 Capital One Email Backend running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;