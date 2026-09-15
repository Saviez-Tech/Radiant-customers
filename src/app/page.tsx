'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { loginCustomer, registerCustomer } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import './Login.css';

type AuthTab = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();

  // ── Tab ──────────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<AuthTab>('login');

  // ── Shared ───────────────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Login fields ─────────────────────────────────────────────────────────
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // ── Register fields ───────────────────────────────────────────────────────
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const switchTab = (next: AuthTab) => {
    setTab(next);
    setError('');
    setSuccess('');
  };

  // ── Login handler ─────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || !loginPassword) return;
    setLoading(true);
    setError('');

    const { data, error: apiErr } = await loginCustomer({
      phone_number: loginPhone,
      password: loginPassword,
    });

    setLoading(false);

    if (apiErr || !data) {
      setError(apiErr ?? 'Login failed. Please try again.');
      return;
    }

    saveSession(data);
    router.push('/dashboard');
  };

  // ── Register handler ──────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regPhone || !regPassword) return;
    setLoading(true);
    setError('');
    setSuccess('');

    const { error: apiErr } = await registerCustomer({
      phone_number: regPhone,
      full_name: regFullName,
      password: regPassword,
    });

    setLoading(false);

    if (apiErr) {
      setError(apiErr);
      return;
    }

    setSuccess('Account created! You can now log in.');
    setRegFullName('');
    setRegPhone('');
    setRegPassword('');
    setTimeout(() => switchTab('login'), 1500);
  };

  return (
    <div className="login-page">
      <div className="login-container animate-fade-in">

        <div className="login-header">
          <Image src="/logo.svg" alt="Radiant Repose Luxury" width={180} height={70} priority />
          <p className="login-copyright">Copyright © {new Date().getFullYear()} - Radiant Repose</p>
        </div>

        {/* ── Tab Switcher ── */}
        <div className="auth-tabs">
          <button
            id="tab-login"
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
            type="button"
          >
            Login
          </button>
          <button
            id="tab-register"
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
            type="button"
          >
            Register
          </button>
        </div>

        <div className="login-body">

          {/* ── Status messages ── */}
          {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
          {success && <p className="auth-message auth-message--success" role="status">{success}</p>}

          {/* ════════════ LOGIN FORM ════════════ */}
          {tab === 'login' && (
            <>
              <h1 className="login-title">Welcome Back!</h1>
              <p className="login-subtitle">Enter your details to continue</p>

              <form onSubmit={handleLogin} className="login-form" noValidate>
                <div className="input-group">
                  <label className="input-label" htmlFor="login-phone">
                    Phone Number
                  </label>
                  <input
                    id="login-phone"
                    type="tel"
                    className="input-field"
                    placeholder="e.g. 08011112222"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="login-password">
                    Password
                  </label>
                  <div className="password-wrapper">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="input-field"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="login-submit-btn"
                  className={`btn btn-primary login-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? <span className="spinner" /> : 'Login'}
                </button>
              </form>
            </>
          )}

          {/* ════════════ REGISTER FORM ════════════ */}
          {tab === 'register' && (
            <>
              <h1 className="login-title">Create Account</h1>
              <p className="login-subtitle">Join the Radiant loyalty programme</p>

              <form onSubmit={handleRegister} className="login-form" noValidate>
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-full-name">
                    Full Name
                  </label>
                  <input
                    id="reg-full-name"
                    type="text"
                    className="input-field"
                    placeholder="e.g. John Doe"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="reg-phone">
                    Phone Number
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    className="input-field"
                    placeholder="e.g. 08011112222"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="reg-password">
                    Password
                  </label>
                  <div className="password-wrapper">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      className="input-field"
                      placeholder="Create a secure password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="register-submit-btn"
                  className={`btn btn-primary login-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? <span className="spinner" /> : 'Create Account'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
