'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Copy,
  CheckCircle2,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { fetchMe } from '@/lib/api';
import { getSession } from '@/lib/auth';
import type { MeResponse, PointHistoryItem } from '@/lib/api';

export default function DashboardOverview() {
  const [filter, setFilter] = useState<'all' | 'added' | 'deducted'>('all');
  const [copied, setCopied] = useState(false);
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const loadData = useCallback(async () => {
    const session = getSession();
    if (!session) return;

    setLoadingData(true);
    setFetchError('');

    const { data, error } = await fetchMe(session.auth_token);

    setLoadingData(false);

    if (error || !data) {
      setFetchError(error ?? 'Failed to load your data.');
      return;
    }

    setMeData(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleCopyCode = () => {
    if (!meData) return;
    navigator.clipboard.writeText(meData.referral_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered: PointHistoryItem[] =
    meData?.point_history.filter((tx) =>
      filter === 'all' ? true : tx.type === filter
    ) ?? [];

  // ─── Loading skeleton ───────────────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="dashboard-content animate-fade-in">
        <div className="data-loading">
          <div className="loading-card skeleton" />
          <div className="loading-rows">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton skeleton-row" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="dashboard-content animate-fade-in">
        <div className="data-error">
          <p className="data-error__msg">{fetchError}</p>
          <button className="retry-btn" onClick={loadData}>
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content animate-fade-in">

      {/* ── 1. OVERVIEW ── */}
      <section id="overview" className="scroll-mt">

        <div className="loyalty-hero-section">
          {/* Virtual Loyalty Card */}
          <div className="virtual-card">
            <div className="virtual-card-glass" />

            <div className="virtual-card-top">
              <div className="brand-logo-white">
                <img src="/logo.svg" alt="Radiant Repose" />
              </div>
              <div className="card-tier">LOYALTY MEMBER</div>
            </div>

            <div className="virtual-card-body">
              <p className="card-label">Current Balance</p>
              <h2 className="card-points">
                {(meData?.balance ?? 0).toLocaleString()} <span className="card-pts">PTS</span>
              </h2>
            </div>

            <div className="virtual-card-footer">
              <div className="footer-item">
                <span className="footer-label">Referral ID</span>
                <span className="footer-value">{meData?.referral_id ?? '—'}</span>
              </div>
              <div className="footer-item">
                <span className="footer-label">Total Referrals</span>
                <span className="footer-value">{meData?.total_referrals ?? 0}</span>
              </div>
            </div>

            {/* Decorative background glows */}
            <div className="card-glow card-glow-1" />
            <div className="card-glow card-glow-2" />
          </div>
        </div>
      </section>

      {/* ── STANDARD SHOP BANNER ── */}
      <div className="standard-shop-banner">
        <div className="standard-shop-text">
          <span className="standard-shop-icon">🛍️</span>
          <span>Earn more points on your next purchase</span>
        </div>
        <a
          href="https://radiantrepose.com"
          target="_blank"
          rel="noopener noreferrer"
          className="standard-shop-btn"
        >
          Continue Shopping
        </a>
      </div>

      {/* ── 2. REDEEM ── */}
      <section id="rewards" className="scroll-mt">
        <h2 className="section-title">Redeem Your Points</h2>

        {/* Code banner */}
        <div className="unique-code-banner">
          <div className="code-info">
            <h3>Your Unique Redemption Code</h3>
            <p>Present this code in-store or enter it at checkout to apply your points.</p>
          </div>
          <div className="code-action">
            <div className="code-display">{meData?.referral_id ?? '—'}</div>
            <button
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopyCode}
              disabled={!meData}
            >
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* How-to cards */}
        <div className="rewards-container">

          <div className="reward-card">
            <div className="reward-icon reward-icon--store">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="reward-info">
              <h4>Redeem In-Store</h4>
              <p>Visit any Radiant Repose location and present your unique code to the cashier to use your points instantly.</p>
            </div>
          </div>

          <div className="reward-card">
            <div className="reward-icon reward-icon--cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div className="reward-info">
              <h4>Redeem at Checkout</h4>
              <p>Enter your unique code in the &ldquo;Promo / Loyalty Code&rdquo; field when checking out online — your discount is applied automatically.</p>
            </div>
          </div>

          <div className="reward-card">
            <div className="reward-icon reward-icon--min">
              <Tag size={26} />
            </div>
            <div className="reward-info">
              <h4>Minimum to Redeem</h4>
              <p>A minimum of <strong style={{ color: 'var(--primary-color)' }}>500 points</strong> is required to redeem. Points are applied as a direct discount on your purchase.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. HISTORY ── */}
      <section id="history" className="scroll-mt">
        <div className="content-section">
          <div className="section-header">
            <h3 className="section-title">Points History</h3>
            <div className="filter-tabs">
              {(['all', 'added', 'deducted'] as const).map((f) => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'added' ? 'Earned' : 'Redeemed'}
                </button>
              ))}
            </div>
          </div>

          <div className="list-container">
            {filtered.map((tx) => (
              <div key={tx.id} className="list-item">
                <div className="tx-icon-wrapper">
                  <div className={`tx-icon ${tx.type === 'added' ? 'earned' : 'redeemed'}`}>
                    {tx.type === 'added' ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                  </div>
                </div>
                <div className="tx-info">
                  <h4 className="tx-description">{tx.title}</h4>
                  <div className="tx-meta">
                    <CalendarDays size={14} />
                    <span>{formatDate(tx.timestamp)}</span>
                  </div>
                </div>
                <div className={`tx-amount ${tx.type === 'added' ? 'earned' : 'redeemed'}`}>
                  {tx.type === 'added' ? '+' : ''}{tx.points} pts
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="empty-state">
                <p>No {filter === 'all' ? '' : filter === 'added' ? 'earned' : 'redeemed'} transactions found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
