import type { LoginResponse } from './api';

const SESSION_KEY = 'radiant_session';

export interface Session {
  id: number;
  phone_number: string;
  full_name: string;
  referral_id: string;
  auth_token: string;
}

export function saveSession(data: LoginResponse): void {
  const session: Session = {
    id: data.id,
    phone_number: data.phone_number,
    full_name: data.full_name,
    referral_id: data.referral_id,
    auth_token: data.auth_token,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
