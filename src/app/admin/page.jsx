'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import AdminOverviewTab from '@/components/AdminOverviewTab';
import AdminUsersTab from '@/components/AdminUsersTab';
import AdminReportsTab from '@/components/AdminReportsTab';
import AdminPayoutsTab from '@/components/AdminPayoutsTab';
import AdminLinksTab from '@/components/AdminLinksTab';
import Toast from '@/components/Toast';
import { authFetch, getCurrentUser, getAuthToken, logout } from '@/utils/auth';

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [metrics, setMetrics] = useState(null);
    const [topPartners, setTopPartners] = useState([]);
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState(null);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3200);
    };

    const loadAdminData = async () => {
        try {
            const [overviewRes, usersRes, reportsRes, payoutsRes, linksRes] = await Promise.all([
                authFetch('/api/admin/overview'),
                authFetch('/api/admin/users'),
                authFetch('/api/admin/reports'),
                authFetch('/api/admin/payouts'),
                authFetch('/api/admin/links'),
            ]);

            if (overviewRes.status === 401) {
                logout();
                return;
            }
            if (overviewRes.status === 403) {
                router.replace('/dashboard');
                return;
            }

            const [overviewData, usersData, reportsData, payoutsData, linksData] = await Promise.all([
                overviewRes.json(),
                usersRes.json(),
                reportsRes.json(),
                payoutsRes.json(),
                linksRes.json(),
            ]);

            if (overviewData.success) {
                setMetrics(overviewData.metrics);
                setTopPartners(overviewData.topPartners || []);
            }
            if (usersData.success) {
                setUsers(usersData.users || []);
            }
            if (reportsData.success) {
                setReports(reportsData);
            }
            if (payoutsData.success) {
                setPayouts(payoutsData.payouts || []);
            }
            if (linksData.success) {
                setLinks(linksData.links || []);
            }
        }
        catch (err) {
            console.error('Error loading admin data:', err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = getAuthToken();
        const user = getCurrentUser();
        if (!token) {
            router.replace('/login');
            return;
        }
        if (user && user.role !== 'admin') {
            router.replace('/dashboard');
            return;
        }
        loadAdminData();
    }, [router]);

    useEffect(() => {
        // Subscribe to SSE real-time stream
        const eventSource = new EventSource('/api/realtime');
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'LINK_CREATED') {
                    setLinks((prev) => [data.link, ...prev]);
                    if (metrics) {
                        setMetrics((prev) => prev ? { ...prev, totalLinks: prev.totalLinks + 1 } : prev);
                    }
                }
                else if (data.type === 'CLICK_REGISTERED') {
                    setLinks((prev) => prev.map((l) => (l.shortSlug === data.slug ? { ...l, clicks: l.clicks + 1, views: l.views + 1 } : l)));
                    if (metrics) {
                        setMetrics((prev) => prev
                            ? {
                                ...prev,
                                totalClicks: prev.totalClicks + 1,
                                totalViews: prev.totalViews + 1,
                            }
                            : prev);
                    }
                }
            }
            catch (e) {
                // SSE parse error
            }
        };
        return () => {
            eventSource.close();
        };
    }, []);
    const handleUpdateStatus = async (userId, newStatus) => {
        const res = await fetch(`/api/admin/users/${userId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (!data.success)
            throw new Error(data.error);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
        loadAdminData();
    };
    const handleUpdateCommission = async (userId, newRate) => {
        const res = await fetch(`/api/admin/users/${userId}/commission`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commissionRate: newRate }),
        });
        const data = await res.json();
        if (!data.success)
            throw new Error(data.error);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, commissionRate: newRate } : u)));
    };
    const handleProcessPayout = async (payoutId, receiptTitle) => {
        const res = await fetch(`/api/admin/payouts/${payoutId}/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiptTitle }),
        });
        const data = await res.json();
        if (!data.success)
            throw new Error(data.error);
        setPayouts((prev) => prev.map((p) => (p.id === payoutId ? { ...p, status: 'paid', receiptTitle } : p)));
        loadAdminData();
    };
    return (<div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      {/* Admin Navigation Bar */}
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} onRefresh={() => {
            loadAdminData();
            showToast('Refreshed platform data!');
        }} pendingApprovals={metrics?.pendingAffiliates || 0} pendingPayouts={metrics?.pendingPayoutsCount || 0}/>

      {/* Main Container */}
      <main style={{ maxWidth: '1180px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        {activeTab === 'overview' && (<AdminOverviewTab metrics={metrics} topPartners={topPartners} onNavigateTab={setActiveTab} showToast={showToast}/>)}

        {activeTab === 'users' && (<AdminUsersTab users={users} onUpdateStatus={handleUpdateStatus} onUpdateCommission={handleUpdateCommission} showToast={showToast}/>)}

        {activeTab === 'reports' && (<AdminReportsTab reports={reports} showToast={showToast}/>)}

        {activeTab === 'payouts' && (<AdminPayoutsTab payouts={payouts} onProcessPayout={handleProcessPayout} showToast={showToast}/>)}

        {activeTab === 'links' && (<AdminLinksTab links={links} showToast={showToast}/>)}
      </main>

      {/* Global Toast Notifications */}
      <Toast message={toastMsg}/>
    </div>);
}
