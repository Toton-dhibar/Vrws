export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const VPS_TARGET = process.env.VPS_TARGET_URL;
  if (!VPS_TARGET) {
    return new Response("VPS_TARGET_URL environment variable is not set", { status: 500 });
  }

  const url = new URL(req.url);
  const targetUrl = VPS_TARGET + url.pathname + url.search;

  // WebSocket
  if (req.headers.get("upgrade")?.toLowerCase() === "websocket") {
    return fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });
  }

  // HTTP normal
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
