// =============================================================================
// Capital One statement-style receipt template (framework-agnostic)
// Used by BOTH the in-app receipt modal and the email backend so the official
// statement look is pixel-identical everywhere.
// Plain JS (ESM) so it runs in the browser and in a Cloudflare Worker.
// =============================================================================

const BRAND_BLUE = '#005C9D';
const BRAND_BLUE_DARK = '#00487D';
const BRAND_RED = '#DA291C';
const INK = '#1A1A1A';
const MUTED = '#5A6472';
const LINE = '#D8DEE6';
const HEAD_BAR = '#0A6CB0';

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function money(n) {
  const num = Number(n) || 0;
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/**
 * Build the standalone HTML document for a Capital One statement-style receipt.
 * @param {object} data
 */
export function buildReceiptHTML(data) {
  const d = data || {};
  const t = d.transaction || {};
  const acct = d.account || {};
  const bal = d.balances || {};

  const holderName = d.holderName || 'Capital One Customer';
  const accountName = acct.accountName || 'Capital One';
  const last4 = acct.last4 || '••••';
  const isCredit = acct.accountType === 'credit';
  const pageLabel = `Page 1 of 1`;
  const accountLine = `${accountName} Account Ending in ${last4}`;
  const period = d.period || new Date(t.date || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
  const billingDays = d.billingDays || 31;

  const amount = Number(t.amount) || 0;
  const isCreditTxn = amount < 0;
  const displayAmount = money(Math.abs(amount));
  const signedAmount = `${isCreditTxn ? '-' : '+'}${displayAmount}`;

  // --- Left column: Payment Information / Transaction Information ---
  const dueDate = acct.paymentDueDate
    ? new Date(acct.paymentDueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : '—';
  const minDue = typeof acct.minPaymentDue === 'number' ? money(acct.minPaymentDue) : money(0);
  const newBalance = numberOr(bal.after, amount);
  const lateFee = acct.lateFee || 39.0;
  const estTotal = money(numberOr(acct.estimatedMinimumTotal, Math.abs(newBalance) * 1.83 + 30));

  const leftBlock = isCredit
    ? `
      <div class="info-grid">
        <div class="cell">
          <span class="lbl">Payment Due Date</span>
          <span class="val">${esc(dueDate)}</span>
          <span class="note">For online and phone payments; the deadline is 8pm ET.</span>
        </div>
        <div class="cell">
          <span class="lbl">&nbsp;</span>
          <span class="val">&nbsp;</span>
          <span class="note">&nbsp;</span>
        </div>
        <div class="cell">
          <span class="lbl">New Balance</span>
          <span class="val">${money(newBalance)}</span>
        </div>
        <div class="cell">
          <span class="lbl">Minimum Payment Due</span>
          <span class="val">${minDue}</span>
        </div>
      </div>
      <div class="warn">
        <strong>LATE PAYMENT WARNING:</strong> If we do not receive your minimum payment by your due date,
        you may have to pay a late fee of up to ${money(lateFee)}.
      </div>
      <div class="warn">
        <strong>MINIMUM PAYMENT WARNING:</strong> If you make only the minimum payment each period, you
        will pay more in interest and it will take you longer to pay off your balance. For example:
      </div>
      <table class="example">
        <thead>
          <tr>
            <th>If you make no additional charges using this card and each month you pay...</th>
            <th>You will pay off the balance shown on this statement in about...</th>
            <th>And you will end up paying an estimated total of...</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Minimum Payment</td>
            <td>10 Years</td>
            <td>${estTotal}</td>
          </tr>
        </tbody>
      </table>
    `
    : `
      <div class="info-grid">
        <div class="cell">
          <span class="lbl">Transaction Date</span>
          <span class="val">${esc(period)}</span>
          <span class="note">Posted to your account and cleared by our ledger.</span>
        </div>
        <div class="cell">
          <span class="lbl">&nbsp;</span>
          <span class="val">&nbsp;</span>
          <span class="note">&nbsp;</span>
        </div>
        <div class="cell">
          <span class="lbl">Amount</span>
          <span class="val">${signedAmount}</span>
        </div>
        <div class="cell">
          <span class="lbl">Status</span>
          <span class="val">${esc(t.status || 'Completed')}</span>
        </div>
      </div>
      <div class="warn">
        <strong>OFFICIAL RECEIPT:</strong> This document is an official Capital One record of your
        transaction <strong>${esc(t.referenceNumber || '')}</strong> for ${esc(t.merchant || 'your transaction')}.
        Retain it for your personal accounting.
      </div>
    `;

  // --- Right column: Account Summary ---
  const previousBalance = numberOr(bal.before, 0);
  const summaryRow = (label, value, sign) => `
    <tr>
      <td class="s-lbl">${esc(label)}</td>
      <td class="s-val">${sign ? `${sign} ` : ''}${value}</td>
    </tr>`;

  const availableCredit = typeof bal.availableCredit === 'number' ? money(bal.availableCredit) : '—';
  const creditLine = typeof bal.creditLimit === 'number' ? money(bal.creditLimit) : '—';

  const rightBlock = `
    <div class="bar">Account Summary</div>
    <table class="summary">
      ${summaryRow('Previous Balance', money(previousBalance))}
      ${summaryRow('Payments', money(-Math.abs(numberOr(bal.payments, 0))))}
      ${summaryRow('Other Credits', '-' + money(numberOr(bal.otherCredits, 0)))}
      ${summaryRow('Transactions', '+' + money(numberOr(bal.transactions, Math.abs(amount))))}
      ${summaryRow('Cash Advances', '+' + money(numberOr(bal.cashAdvances, 0)))}
      ${summaryRow('Fees Charged', '+' + money(numberOr(bal.feesCharged, 0)))}
      ${summaryRow('Interest Charged', '+' + money(numberOr(bal.interestCharged, 0)))}
      <tr class="total">
        <td class="s-lbl">New Balance</td>
        <td class="s-val">${money(newBalance)}</td>
      </tr>
    </table>
    <div class="credit-box">
      <div class="credit-row"><span>Credit Line</span><span>${creditLine}</span></div>
      <div class="credit-row"><span>Available Credit (as of ${esc(period)})</span><span>${availableCredit}</span></div>
    </div>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Capital One Receipt — ${esc(t.referenceNumber || '')}</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #EEF2F6; font-family: "Helvetica Neue", Arial, "Plus Jakarta Sans", sans-serif; color: ${INK}; }
  .page { max-width: 760px; margin: 16px auto; background: #fff; padding: 26px 28px 30px; border: 1px solid ${LINE}; }
  .doc-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; border-bottom: 2px solid ${LINE}; padding-bottom: 12px; }
  .logo svg { height: 34px; width: auto; display: block; }
  .meta { text-align: right; font-size: 11px; line-height: 1.5; color: ${INK}; max-width: 360px; }
  .meta .p1 { font-weight: 700; }
  .meta .acct { font-weight: 700; }
  .columns { display: flex; gap: 20px; margin-top: 18px; align-items: flex-start; }
  .col { flex: 1; min-width: 0; }
  .bar { background: ${HEAD_BAR}; color: #fff; font-size: 13px; font-weight: 700; letter-spacing: .2px; padding: 6px 10px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid ${LINE}; border-top: none; }
  .cell { padding: 8px 10px; border-bottom: 1px solid ${LINE}; min-height: 58px; }
  .cell:nth-child(odd) { border-right: 1px solid ${LINE}; }
  .lbl { display: block; font-size: 10.5px; color: ${MUTED}; text-transform: none; }
  .val { display: block; font-size: 17px; font-weight: 700; margin-top: 2px; }
  .note { display: block; font-size: 9.5px; color: ${MUTED}; margin-top: 3px; line-height: 1.35; }
  .warn { border: 1px solid #E4B84B; background: #FFFDF5; color: ${INK}; font-size: 10.5px; line-height: 1.45; padding: 8px 10px; margin-top: 10px; }
  .warn strong { color: #8A6D1B; }
  table.example { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9.5px; }
  table.example th, table.example td { border: 1px solid ${LINE}; padding: 6px 7px; text-align: left; vertical-align: top; }
  table.example th { background: #F4F7FA; font-weight: 700; }
  table.summary { width: 100%; border-collapse: collapse; border: 1px solid ${LINE}; border-top: none; font-size: 11.5px; }
  table.summary td { padding: 7px 10px; border-bottom: 1px solid ${LINE}; }
  table.summary .s-lbl { color: ${MUTED}; }
  table.summary .s-val { text-align: right; font-weight: 600; white-space: nowrap; }
  table.summary tr.total td { border-top: 2px solid ${LINE}; border-bottom: none; font-weight: 800; font-size: 13px; }
  .credit-box { margin-top: 12px; border: 1px solid ${LINE}; font-size: 11.5px; }
  .credit-row { display: flex; justify-content: space-between; padding: 7px 10px; border-bottom: 1px solid ${LINE}; }
  .credit-row:last-child { border-bottom: none; }
  .credit-row span:last-child { font-weight: 700; }
  .txn-strip { margin-top: 16px; border: 1px solid ${LINE}; }
  .txn-strip .bar { background: ${BRAND_BLUE_DARK}; }
  .txn-row { display: flex; justify-content: space-between; padding: 8px 12px; font-size: 12px; border-bottom: 1px solid ${LINE}; }
  .txn-row:last-child { border-bottom: none; }
  .txn-row .k { color: ${MUTED}; }
  .txn-row .v { font-weight: 600; text-align: right; }
  .txn-amount { font-size: 20px; font-weight: 800; color: ${isCreditTxn ? BRAND_BLUE : '#0E7C4A'}; }
  .footer { margin-top: 20px; border-top: 1px solid ${LINE}; padding-top: 12px; font-size: 10px; color: ${MUTED}; line-height: 1.6; }
  .footer .brandline { color: ${INK}; font-weight: 700; }
  .support { margin-top: 8px; padding: 9px 11px; background: #F4F7FA; border: 1px solid ${LINE}; font-size: 10.5px; }
  .support a { color: ${BRAND_BLUE}; font-weight: 700; text-decoration: none; }
  .swoosh { color: ${BRAND_RED}; }
  @media print { body { background: #fff; } .page { border: none; margin: 0; max-width: none; } }
</style>
</head>
<body>
  <div class="page">
    <div class="doc-header">
      <div class="logo" aria-label="Capital One">
        <svg viewBox="0 0 230 52" xmlns="http://www.w3.org/2000/svg" role="img">
          <path d="M18 22C42 10 94 4 148 8C182 11 202 18 208 22C194 18 166 11 136 9C86 6 42 12 18 22Z" fill="${BRAND_RED}"/>
          <path d="M142 8C168 11 192 17 206 22C198 20 174 14 146 11C118 8 72 10 32 20C48 14 96 6 142 8Z" fill="${BRAND_RED}"/>
          <text x="12" y="38" font-family="Georgia, 'Times New Roman', serif" font-size="29" font-weight="700" font-style="italic" fill="${BRAND_BLUE}">Capital</text>
          <text x="112" y="38" font-family="Georgia, 'Times New Roman', serif" font-size="29" font-weight="400" font-style="italic" fill="${BRAND_BLUE}">One</text>
        </svg>
      </div>
      <div class="meta">
        <div class="p1">${esc(pageLabel)}</div>
        <div class="acct">${esc(accountLine)}</div>
        <div>${esc(period)} | ${esc(String(billingDays))} days in Billing Cycle</div>
      </div>
    </div>

    <div class="columns">
      <section class="col">
        <div class="bar">${isCredit ? 'Payment Information' : 'Transaction Information'}</div>
        ${isCredit ? '' : '<div style="height:0"></div>'}
        ${leftBlock}
      </section>

      <section class="col">
        ${rightBlock}
      </section>
    </div>

    <div class="txn-strip">
      <div class="bar">Transaction Details</div>
      <div class="txn-row"><span class="k">Account Holder</span><span class="v">${esc(holderName)}</span></div>
      <div class="txn-row"><span class="k">Reference Number</span><span class="v">${esc(t.referenceNumber || '')}</span></div>
      <div class="txn-row"><span class="k">Merchant / Description</span><span class="v">${esc(t.merchant || '')}</span></div>
      <div class="txn-row"><span class="k">Type</span><span class="v">${esc(t.type || '')}</span></div>
      <div class="txn-row"><span class="k">Category</span><span class="v">${esc(t.category || '—')}</span></div>
      <div class="txn-row"><span class="k">Status</span><span class="v">${esc(t.status || '')}</span></div>
      ${t.destinationDetails ? `<div class="txn-row"><span class="k">Details</span><span class="v">${esc(t.destinationDetails)}</span></div>` : ''}
      ${t.adminFeedback ? `<div class="txn-row"><span class="k">Administrative Note</span><span class="v">${esc(t.adminFeedback)}</span></div>` : ''}
      <div class="txn-row"><span class="k">Amount</span><span class="v txn-amount">${signedAmount}</span></div>
      <div class="txn-row"><span class="k">Balance Before</span><span class="v">${money(numberOr(bal.before, 0))}</span></div>
      <div class="txn-row"><span class="k">Available Balance</span><span class="v">${money(numberOr(bal.after, 0))}</span></div>
    </div>

    <div class="footer">
      <div class="brandline">Capital One, N.A. — Official Transaction Receipt</div>
      <div>Member FDIC. Equal Housing Lender. This receipt is an electronic record of your transaction and may be used for your records. Please retain it for your personal accounting.</div>
      <div>Routing (ABA) 051405515 · SWIFT ${esc(acct.swiftCode || 'HIBKUS44')}</div>
      <div>Questions? Visit <span style="color:${BRAND_BLUE};font-weight:700">capitalone.com</span> or call 1-877-383-4802.</div>
      <div class="support">
        Need help or believe this transaction is incorrect?
        Contact our support team from the Capital One app (Support &rarr; Chat) or email
        <a href="mailto:support@capitalone.com">support@capitalone.com</a> quoting reference
        <strong>${esc(t.referenceNumber || '')}</strong>. Human support is available 24/7.
      </div>
    </div>
  </div>
</body>
</html>`;

  return html;
}

function numberOr(value, fallback) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : Number(fallback) || 0;
}

export default buildReceiptHTML;
