'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import OverviewSection from '@/components/OverviewSection';
import EarningsSection from '@/components/EarningsSection';
import PayoutsSection from '@/components/PayoutsSection';
import SettingsSection from '@/components/SettingsSection';
import Toast from '@/components/Toast';
import { getAuthToken, getCurrentUser, authFetch, logout } from '@/utils/auth';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [toastMsg, setToastMsg] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => {
            setToastMsg(null);
        }, 3200);
    };

    useEffect(() => {
        setMounted(true);
        const token = getAuthToken();
        if (!token) {
            router.replace('/login');
            return;
        }

        const cachedUser = getCurrentUser();
        if (cachedUser) {
            setCurrentUser(cachedUser);
            setIsLoadingAuth(false);
        }

        // Verify session live with backend
        authFetch('/api/auth/me')
            .then((res) => {
                if (res.status === 401) {
                    logout();
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (data && data.success && data.user) {
                    setCurrentUser(data.user);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('linkcraft_user', JSON.stringify(data.user));
                    }
                }
            })
            .catch(() => {})
            .finally(() => {
                setIsLoadingAuth(false);
            });
    }, [router]);

    if (!mounted || isLoadingAuth) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F7F8FC',
            }}>
                <div style={{
                    width: '42px',
                    height: '42px',
                    border: '3px solid #6366F1',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '1rem',
                }} />
                <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.9375rem' }}>
                    Verifying secure access...
                </p>
            </div>
        );
    }

    const isAdmin = currentUser?.role === 'admin';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FC', color: '#1E1B4B' }}>
            {/* Top Admin Notice if logged in with Admin account */}
            {isAdmin && (
                <div style={{
                    backgroundColor: '#1E1B4B',
                    color: '#E0E7FF',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={18} color="#818CF8" />
                        <span>
                            Viewing Partner Portal as <strong>Platform Admin</strong> ({currentUser.email}).
                        </span>
                    </div>
                    <button
                        onClick={() => router.push('/admin')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            backgroundColor: '#6366F1',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        <span>Return to Admin Console</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            )}

            {/* Top Header Navigation matching screenshots */}
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Container */}
            <main style={{ maxWidth: '980px', margin: '0 auto', padding: '1.5rem 1rem' }}>
                {activeTab === 'overview' && (<OverviewSection showToast={showToast} />)}

                {activeTab === 'earnings' && (<EarningsSection showToast={showToast} />)}

                {activeTab === 'payouts' && (<PayoutsSection showToast={showToast} onOpenPayoutModal={() => { }} />)}

                {activeTab === 'profile' && (<SettingsSection showToast={showToast} />)}
            </main>

            {/* Toast Notifications */}
            <Toast message={toastMsg} />
        </div>
    );
}

