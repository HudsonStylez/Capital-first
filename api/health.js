// Vercel serverless function: GET /api/health
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    email: process.env.SENDGRID_API_KEY
      ? 'sendgrid'
      : process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN
      ? 'mailgun'
      : 'mock',
  });
}
