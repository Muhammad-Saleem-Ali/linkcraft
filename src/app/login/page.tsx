'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Link as LinkIcon, Eye, EyeOff, Key, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('hafizahmar050@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handlePasskeyLogin = () => {
    setIsPasskeyLoading(true);
    setTimeout(() => {
      setIsPasskeyLoading(false);
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', color: '#0F172A', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Bar */}
      <header
        style={{
          height: '64px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Brand Logo */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #F59E0B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LinkIcon size={16} color="#FFFFFF" />
            </div>
          </div>
          <span style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            LinkCraft
          </span>
        </Link>

        {/* Right Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              padding: '0.375rem 0.875rem',
              borderRadius: '99px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.8438rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Globe size={15} />
            <span>EN</span>
          </button>

          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>Login</span>
        </div>
      </header>

      {/* Main Login Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
        
        {/* Brand Logo & Welcome Text */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #F59E0B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
              }}
            >
              <LinkIcon size={22} color="#FFFFFF" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>
                LinkCraft
              </span>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#06B6D4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                AFFILIATE SHOWCASE ENGINE
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#64748B' }}>
            Sign in to your Amazon Associate account
          </p>
        </div>

        {/* Login Card */}
        <div
          className="ilearner-card animate-fade-in"
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '2.25rem 2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            border: '1px solid #E2E8F0',
          }}
        >
          <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ color: '#334155', fontWeight: 600 }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ borderRadius: '10px', fontSize: '0.9375rem' }}
              />
            </div>

            {/* Password Field */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ color: '#334155', fontWeight: 600 }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '2.5rem', borderRadius: '10px', fontSize: '0.9375rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div style={{ textAlign: 'right', marginTop: '0.375rem' }}>
                <a href="#" style={{ fontSize: '0.8125rem', color: '#06B6D4', fontWeight: 700, textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Sign in Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-teal"
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                marginTop: '0.5rem',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: '1.5rem 0',
              color: '#94A3B8',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            <span>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          </div>

          {/* Sign in with Passkey Button */}
          <button
            onClick={handlePasskeyLogin}
            disabled={isPasskeyLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
          >
            <Key size={16} color="#475569" />
            <span>{isPasskeyLoading ? 'Authenticating Passkey...' : 'Sign in with passkey'}</span>
          </button>
        </div>

        {/* Invite-only Notice */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748B' }}>
          Accounts are invite-only for verified Amazon Associates.
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', opacity: 0.8 }}>
        © 2026 LinkCraft Engine. All rights reserved.
      </footer>
    </div>
  );
}
