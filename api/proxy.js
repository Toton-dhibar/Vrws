
// WebSocket Relay para Vercel PRO
// Endpoint: /api/ws

export const config = {
  runtime: 'edge',
  regions: ['iad1']
};

export default async function handler(request) {
  const upgradeHeader = request.headers.get('upgrade');
  
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket', { status: 426 });
  }
  
  const TARGET_WS_URL = process.env.TARGET_WS_URL || 'wss://zz.sdbuild.me:443';
  const RELAY_PATH = process.env.WS_PATH || '/vless';
  const url = new URL(request.url);
  
  if (url.pathname !== RELAY_PATH) {
    return new Response('Not Found', { status: 404 });
  }
  
  // Cria conexão WebSocket com o upstream
  try {
    const upgradeResponse = await fetch(TARGET_WS_URL, {
      headers: {
        upgrade: 'websocket',
        connection: 'upgrade',
        'sec-websocket-key': request.headers.get('sec-websocket-key'),
        'sec-websocket-version': request.headers.get('sec-websocket-version')
      }
    });
    
    return upgradeResponse;
    
  } catch (err) {
    console.error('WebSocket error:', err.message);
    return new Response('Bad Gateway', { status: 502 });
  }
}
