'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Link as LinkIcon, Eye, EyeOff, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getAuthToken, getCurrentUser, authFetch } from '@/utils/auth';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState('signin');
    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // Loading & error states
    const [isLoading, setIsLoading] = useState(false);
    const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const token = getAuthToken();
        const user = getCurrentUser();
        if (token && user) {
            authFetch('/api/auth/me')
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('stale');
                })
                .then(data => {
                    if (data.success && data.user) {
                        if (data.user.role === 'admin') router.push('/admin');
                        else router.push('/dashboard');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('linkcraft_token');
                    localStorage.removeItem('linkcraft_user');
                });
        }
    }, [router]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password)
            return;
        if (mode === 'register' && !name.trim())
            return;
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
        const payload = mode === 'register'
            ? { name: name.trim(), email: email.trim(), password }
            : { email: email.trim(), password };
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success && data.token) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('linkcraft_token', data.token);
                    if (data.user) {
                        localStorage.setItem('linkcraft_user', JSON.stringify(data.user));
                    }
                }
                if (mode === 'register') {
                    setSuccessMessage('Account created successfully! Redirecting...');
                    setTimeout(() => router.push('/dashboard'), 800);
                }
                else {
                    if (data.user?.role === 'admin') {
                        router.push('/admin');
                    }
                    else {
                        router.push('/dashboard');
                    }
                }
            }
            else {
                setErrorMessage(data.error || 'Authentication failed. Please verify your details.');
            }
        }
        catch {
            setErrorMessage('Could not connect to authentication server. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handlePasskeyLogin = () => {
        setIsPasskeyLoading(true);
        setTimeout(() => {
            setIsPasskeyLoading(false);
            setErrorMessage('Passkey is not enrolled on this browser yet. Please sign in with your email and password.');
        }, 400);
    };
    return (<div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', color: '#0F172A', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Bar */}
      <header style={{
            height: '64px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
        {/* Brand Logo */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #F59E0B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
              <LinkIcon size={16} color="#FFFFFF"/>
            </div>
          </div>
          <span style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            LinkCraft
          </span>
        </Link>

        {/* Right Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button style={{
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
        }}>
            <Globe size={15}/>
            <span>EN</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
        
        {/* Card Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #F59E0B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
        }}>
              <LinkIcon size={22} color="#FFFFFF"/>
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
            {mode === 'signin' ? 'Welcome back' : 'Create an Account'}
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#64748B' }}>
            {mode === 'signin'
            ? 'Sign in to your Amazon Associate account'
            : 'Register as an affiliate partner to start earning commissions'}
          </p>
        </div>

        {/* Login / Register Card */}
        <div className="ilearner-card animate-fade-in" style={{
            width: '100%',
            maxWidth: '460px',
            padding: '2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            border: '1px solid #E2E8F0',
        }}>
          {/* Segmented Mode Pill Tab */}
          <div style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            borderRadius: '12px',
            padding: '0.25rem',
            marginBottom: '1.5rem',
        }}>
            <button type="button" onClick={() => {
            setMode('signin');
            setErrorMessage(null);
            setSuccessMessage(null);
        }} style={{
            flex: 1,
            padding: '0.625rem 0',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: mode === 'signin' ? '#FFFFFF' : 'transparent',
            color: mode === 'signin' ? '#0F172A' : '#64748B',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: mode === 'signin' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
            transition: 'all 0.2s',
        }}>
              Sign In
            </button>
            <button type="button" onClick={() => {
            setMode('register');
            setErrorMessage(null);
            setSuccessMessage(null);
        }} style={{
            flex: 1,
            padding: '0.625rem 0',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
            color: mode === 'register' ? '#0F172A' : '#64748B',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: mode === 'register' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
            transition: 'all 0.2s',
        }}>
              Create Account
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (<div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }}/>
              <span>{errorMessage}</span>
            </div>)}

          {/* Success Message Alert */}
          {successMessage && (<div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#059669',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }}/>
              <span>{successMessage}</span>
            </div>)}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Name Field (Register Mode Only) */}
            {mode === 'register' && (<div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ color: '#334155', fontWeight: 600 }}>
                  Full Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input type="text" required placeholder="e.g. Ali Khan" value={name} onChange={(e) => setName(e.target.value)} className="input-field" style={{ borderRadius: '10px', fontSize: '0.9375rem' }}/>
              </div>)}

            {/* Email Field */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ color: '#334155', fontWeight: 600 }}>
                Email Address <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={{ borderRadius: '10px', fontSize: '0.9375rem' }}/>
            </div>

            {/* Password Field */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ color: '#334155', fontWeight: 600 }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} required placeholder={mode === 'register' ? 'Choose a secure password' : 'Enter your password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" style={{ paddingRight: '2.5rem', borderRadius: '10px', fontSize: '0.9375rem' }}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
        }}>
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              {mode === 'signin' && (<div style={{ textAlign: 'right', marginTop: '0.375rem' }}>
                  <a href="#" style={{ fontSize: '0.8125rem', color: '#06B6D4', fontWeight: 700, textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>)}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="btn-teal" style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '12px',
            fontSize: '0.9375rem',
            marginTop: '0.5rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
        }}>
              {isLoading
            ? (mode === 'register' ? 'Creating Account...' : 'Signing in...')
            : (mode === 'register' ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle between Sign In & Register */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748B' }}>
            {mode === 'signin' ? (<span>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => {
                setMode('register');
                setErrorMessage(null);
            }} style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                  Create one now
                </button>
              </span>) : (<span>
                Already have an account?{' '}
                <button type="button" onClick={() => {
                setMode('signin');
                setErrorMessage(null);
            }} style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                  Sign in
                </button>
              </span>)}
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.5rem 0',
            color: '#94A3B8',
            fontSize: '0.75rem',
            fontWeight: 500,
        }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }}/>
            <span>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }}/>
          </div>

          {/* Sign in with Passkey Button */}
          <button onClick={handlePasskeyLogin} disabled={isPasskeyLoading} style={{
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
        }}>
            <Key size={16} color="#475569"/>
            <span>{isPasskeyLoading ? 'Authenticating Passkey...' : 'Sign in with passkey'}</span>
          </button>
        </div>

        {/* Invite-only / Verified Partner Notice */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748B' }}>
          Verified Amazon Associates & Partner Portal
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', opacity: 0.8 }}>
        © 2026 LinkCraft Engine. All rights reserved.
      </footer>
    </div>);
}
