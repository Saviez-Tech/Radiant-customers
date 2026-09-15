'use client';

import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSession, clearSession } from '@/lib/auth';
import type { Session } from '@/lib/auth';
import './Dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace('/');
      return;
    }
    setSession(s);
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push('/');
  };

  // Derive avatar initial from full name
  const avatarLetter = session?.full_name?.charAt(0).toUpperCase() ?? '?';
  const displayName = session?.full_name ?? 'Loading…';

  // Don't render the shell until we've confirmed a valid session
  if (!session) return null;

  return (
    <div className="dashboard-layout">

      {/* ── UNIFIED TOP NAV ── */}
      <header className="unified-header">
        <div className="header-logo">
          <Image src="/logo.svg" alt="Radiant Repose" width={140} height={50} priority />
        </div>

        <div className="header-right">
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className="user-role">Loyalty Member</span>
            </div>
            <div className="user-avatar">{avatarLetter}</div>
          </div>

          <button
            className="logout-btn-header"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut size={20} />
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">
        {children}
      </main>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Radiant Repose Luxury. All rights reserved.</p>
      </footer>
    </div>
  );
}
