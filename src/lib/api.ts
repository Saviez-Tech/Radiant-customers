// ─── Base URL ────────────────────────────────────────────────────────────────
// Reads from NEXT_PUBLIC_API_URL in .env.local
// Set it to your backend's base URL (e.g. http://localhost:8000)
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn('[api] NEXT_PUBLIC_API_URL is not set — falling back to http://localhost:8000');
}
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');

// ─── Response Types ──────────────────────────────────────────────────────────

export interface RegisterResponse {
  message: string;
  phone_number?: string;
}

export interface LoginResponse {
  message: string;
  id: number;
  phone_number: string;
  full_name: string;
  referral_id: string;
  auth_token: string;
}

export interface PointHistoryItem {
  id: number;
  title: string;
  points: number;
  type: 'added' | 'deducted';
  timestamp: string;
}

export interface ReferralItem {
  id: number;
  phone_number: string;
  referral_code: string;
  note: string;
  staff: string;
  timestamp: string;
}

export interface MeResponse {
  referral_id: string;
  phone_number: string;
  balance: number;
  total_referrals: number;
  referrals: ReferralItem[];
  point_history: PointHistoryItem[];
}

// ─── Error shape ─────────────────────────────────────────────────────────────

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

// ─── Core fetch helper ───────────────────────────────────────────────────────

interface FetchOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

export async function apiFetch<T>(
  path: string,
  { method = 'GET', body, token }: FetchOptions = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  // Paths starting with /api/proxy/ are same-origin Next.js route handlers
  // (used to avoid CORS on authenticated endpoints). Don't prepend BASE_URL.
  const url = path.startsWith('/api/proxy/') ? path : `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const json = (await res.json()) as T & ApiError;

    if (!res.ok) {
      // Surface the most descriptive error message from the response
      const errMsg =
        (json as ApiError).detail ??
        (json as ApiError).message ??
        Object.values(json as Record<string, unknown>)
          .flat()
          .join(', ') ??
        'Something went wrong.';
      return { data: null, error: errMsg, status: res.status };
    }

    return { data: json, error: null, status: res.status };
  } catch {
    return { data: null, error: 'Network error. Please check your connection.', status: 0 };
  }
}

// ─── Endpoint helpers ────────────────────────────────────────────────────────

export const registerCustomer = (payload: {
  phone_number: string;
  full_name: string;
  password: string;
}) =>
  apiFetch<RegisterResponse>('/api/customers/register/', {
    method: 'POST',
    body: payload,
  });

export const loginCustomer = (payload: { phone_number: string; password: string }) =>
  apiFetch<LoginResponse>('/api/customers/login/', {
    method: 'POST',
    body: payload,
  });

// Routed through the Next.js proxy to avoid CORS preflight failures.
// See: src/app/api/proxy/me/route.ts
export const fetchMe = (token: string) =>
  apiFetch<MeResponse>('/api/proxy/me', { token });
