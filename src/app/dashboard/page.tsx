'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  Award,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Copy,
  CheckCircle2
} from 'lucide-react';

export default function DashboardOverview() {
  const [filter, setFilter] = useState<'all' | 'earned' | 'redeemed'>('all');
  const [copied, setCopied] = useState(false);

  const user = {
    points: 1250,
    pointsWorth: 125.00,
    uniqueCode: 'RAD-LUX-8X9B2'
  };

  const transactions = [
    { id: 1, type: 'earned', description: 'Purchase: Luxury Silk Robe', points: 150, date: '2026-07-15T14:30:00' },
    { id: 2, type: 'redeemed', description: 'Reward: 10% Off Next Order', points: 500, date: '2026-07-10T09:15:00' },
    { id: 3, type: 'earned', description: 'Purchase: Aromatherapy Set', points: 75, date: '2026-07-02T16:45:00' },
    { id: 4, type: 'earned', description: 'Welcome Bonus', points: 500, date: '2026-06-28T10:00:00' },
    { id: 5, type: 'earned', description: 'Birthday Reward', points: 200, date: '2026-06-15T00:00:00' },
    { id: 6, type: 'redeemed', description: 'Reward: Free Shipping', points: 100, date: '2026-05-20T11:20:00' },
  ];

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.uniqueCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = transactions.filter(tx =>
    filter === 'all' ? true : tx.type === filter
  );

  return (
    <div className="dashboard-content animate-fade-in">

      {/* ── 1. OVERVIEW ── */}
      <section id="overview" className="scroll-mt">

        <div className="loyalty-hero-section">
          {/* Virtual Loyalty Card */}
          <div className="virtual-card">
            <div className="virtual-card-glass"></div>

            <div className="virtual-card-top">
              <div className="brand-logo-white">
                <img src="/logo.svg" alt="Radiant Repose" />
              </div>
              <div className="card-tier">VIP MEMBER</div>
            </div>

            <div className="virtual-card-body">
              <p className="card-label">Current Balance</p>
              <h2 className="card-points">
                {user.points.toLocaleString()} <span className="card-pts">PTS</span>
              </h2>
            </div>

            <div className="virtual-card-footer">
              <div className="footer-item">
                <span className="footer-label">Value</span>
                <span className="footer-value">${user.pointsWorth.toFixed(2)}</span>
              </div>
              <div className="footer-item">
                <span className="footer-label">Lifetime Earned</span>
                <span className="footer-value">{(user.points + 600).toLocaleString()} pts</span>
              </div>
            </div>

            {/* Decorative background glows */}
            <div className="card-glow card-glow-1"></div>
            <div className="card-glow card-glow-2"></div>
          </div>
        </div>
      </section>

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
            <div className="code-display">{user.uniqueCode}</div>
            <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyCode}>
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* How-to cards */}
        <div className="rewards-container">

          <div className="reward-card">
            <div className="reward-icon reward-icon--store">
              {/* House / store icon */}
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
              {/* Shopping cart icon */}
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
              {(['all', 'earned', 'redeemed'] as const).map(f => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="list-container">
            {filtered.map((tx) => (
              <div key={tx.id} className="list-item">
                <div className="tx-icon-wrapper">
                  <div className={`tx-icon ${tx.type}`}>
                    {tx.type === 'earned' ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                  </div>
                </div>
                <div className="tx-info">
                  <h4 className="tx-description">{tx.description}</h4>
                  <div className="tx-meta">
                    <CalendarDays size={14} />
                    <span>{formatDate(tx.date)}</span>
                  </div>
                </div>
                <div className={`tx-amount ${tx.type}`}>
                  {tx.type === 'earned' ? '+' : '-'}{tx.points} pts
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="empty-state">
                <p>No {filter} transactions found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
