// ─── Base URL ────────────────────────────────────────────────────────────────
// All requests are routed through Next.js server-side proxy routes (/api/proxy/*)
// to avoid CORS issues. NEXT_PUBLIC_API_URL is no longer used for direct browser calls.
// The actual backend URL is set via API_URL in .env.local (server-side only).

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

  // All paths go through same-origin Next.js proxy routes — no BASE_URL needed.
  const url = path;

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

// Routed through the Next.js proxy to avoid CORS (same-origin → server → Django).
// See: src/app/api/proxy/register/route.ts
export const registerCustomer = (payload: {
  phone_number: string;
  full_name: string;
  password: string;
}) =>
  apiFetch<RegisterResponse>('/api/proxy/register', {
    method: 'POST',
    body: payload,
  });

// Routed through the Next.js proxy to avoid CORS (same-origin → server → Django).
// See: src/app/api/proxy/login/route.ts
export const loginCustomer = (payload: { phone_number: string; password: string }) =>
  apiFetch<LoginResponse>('/api/proxy/login', {
    method: 'POST',
    body: payload,
  });

// Routed through the Next.js proxy to avoid CORS preflight failures.
// See: src/app/api/proxy/me/route.ts
export const fetchMe = (token: string) =>
  apiFetch<MeResponse>('/api/proxy/me', { token });
