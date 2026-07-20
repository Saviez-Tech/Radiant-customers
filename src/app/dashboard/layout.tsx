'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './Dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

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
              <span className="user-name">Amanda Admin</span>
              <span className="user-role">Premium Member</span>
            </div>
            <div className="user-avatar">A</div>
          </div>

          <button className="logout-btn-header" onClick={() => router.push('/')} aria-label="Logout">
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
