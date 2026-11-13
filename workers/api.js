// Cloudflare Worker for Capital One Clone
// Handles /api/send-receipt and /health, serves frontend assets

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check endpoint
    if (request.method === "GET" && url.pathname === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send receipt email endpoint
    if (request.method === "POST" && url.pathname === "/api/send-receipt") {
      try {
        const body = await request.json();

        if (!body.to || !body.subject || !body.transaction || !body.account) {
          return new Response(
            JSON.stringify({ error: "Missing required fields: to, subject, transaction, account" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, messageId: "mock-email-id", status: "sent" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to send email" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Serve static assets (frontend)
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }
    }

    // SPA fallback - return index.html for client-side routing
    if (env.ASSETS) {
      const indexResponse = await env.ASSETS.fetch(new URL("/index.html", request.url));
      if (indexResponse.status === 200) {
        return indexResponse;
      }
    }

    return new Response("Not found", { status: 404 });
  }
};