// Cloudflare Worker for Capital One API
// Handles /api/send-receipt and /health endpoints

addEventListener("fetch", async (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Health check endpoint
  if (url.pathname === "/health") {
    event.respondWith(
      new Response(
        JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      )
    );
    return;
  }

  // Send receipt email endpoint
  if (url.pathname === "/api/send-receipt") {
    if (request.method !== "POST") {
      event.respondWith(
        new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", Allow: "POST" }
        })
      );
      return;
    }

    try {
      const body = await request.json();

      // Validate required fields
      if (!body.to || !body.subject || !body.transaction || !body.account) {
        event.respondWith(
          new Response(
            JSON.stringify({
              error: "Missing required fields: to, subject, transaction, account"
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          )
        );
        return;
      }

      // Simulated response. In production, replace with real email provider
      // (SendGrid/Mailgun) via fetch to their API.
      event.respondWith(
        new Response(
          JSON.stringify({
            success: true,
            messageId: "mock-email-id",
            status: "sent"
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        )
      );
      return;
    } catch (error) {
      event.respondWith(
        new Response(JSON.stringify({ error: "Failed to send email" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        })
      );
      return;
    }
  }

  // Default response for unknown routes
  event.respondWith(
    new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    })
  );
});
