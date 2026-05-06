// XHTTP endpoint otimizado para Vercel PRO

const TARGET_URL = process.env.TARGET_DOMAIN?.replace(/\/$/, '');
const RELAY_PATH = process.env.RELAY_PATH || '';

export const config = {
  runtime: 'edge',
  regions: ['iad1', 'fra1', 'hnd1']
};

export default async function handler(request) {
  const url = new URL(request.url);
  const requestPath = url.pathname;
  
  if (RELAY_PATH && !requestPath.startsWith(RELAY_PATH)) {
    return new Response('Not Found', { status: 404 });
  }
  
  if (!TARGET_URL) {
    return new Response('Missing TARGET_DOMAIN', { status: 500 });
  }
  
  const upstreamUrl = ${TARGET_URL}${requestPath}${url.search || ''};
  
  try {
    const body = await request.arrayBuffer();
    const headers = {
      'Content-Type': request.headers.get('Content-Type') || 'application/octet-stream',
      'User-Agent': 'vercel-edge-proxy'
    };
    
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });
    
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: {
        'Content-Type': upstreamResponse.headers.get('Content-Type') || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (err) {
    return new Response('Bad Gateway', { status: 502 });
  }
  }
