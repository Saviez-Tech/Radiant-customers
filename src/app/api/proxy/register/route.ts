import type { NextRequest } from 'next/server';

// Server-side only — uses API_URL (never sent to the browser, no CORS issues).
const BACKEND = (process.env.API_URL ?? 'https://radiantrepose-backend.onrender.com').replace(/\/$/, '');

/**
 * POST /api/proxy/register
 *
 * Proxies to Django's /api/customers/register/ endpoint server-to-server,
 * bypassing CORS restrictions when running locally.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND}/api/customers/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
