import type { NextRequest } from 'next/server';

// Server-side only — uses API_URL (no NEXT_PUBLIC_ prefix, never sent to the browser).
// In .env.local: API_URL=http://localhost:8000
const BACKEND = (process.env.API_URL ?? 'https://radiantrepose-backend.onrender.com').replace(/\/$/, '');

/**
 * GET /api/proxy/me
 *
 * Proxies to the Django backend's /api/me/referrals-and-points/ endpoint.
 * The browser calls this same-origin route (no CORS preflight), and this
 * handler forwards the Authorization header server-to-server to Django.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization') ?? '';

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND}/api/customers/me/referrals-and-points/`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      { detail: 'Could not reach the backend server.' },
      { status: 502 }
    );
  }

  const json = await backendRes.json();
  return Response.json(json, { status: backendRes.status });
}
