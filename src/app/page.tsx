'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import './Login.css';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-container animate-fade-in">
        
        <div className="login-header">
          <Image src="/logo.svg" alt="Radiant Repose Luxury" width={180} height={70} priority />
          <p className="login-copyright">Copyright © {new Date().getFullYear()} - Radiant Repose</p>
        </div>

        <div className="login-body">
          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">Enter your details to continue</p>

          <form onSubmit={handleLogin} className="login-form" noValidate>
            <div className="input-group">
              <label className="input-label" htmlFor="identifier">
                Email or Phone Number
              </label>
              <input
                id="identifier"
                type="text"
                className="input-field"
                placeholder="Enter your email or Phone Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? (
                <span className="spinner" />
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
