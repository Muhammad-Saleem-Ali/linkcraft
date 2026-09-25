'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import OverviewSection from '@/components/OverviewSection';
import EarningsSection from '@/components/EarningsSection';
import LinksSection from '@/components/LinksSection';
import PayoutsSection from '@/components/PayoutsSection';
import SettingsSection from '@/components/SettingsSection';
import Toast from '@/components/Toast';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FC', color: '#1E1B4B' }}>
      {/* Top Header Navigation matching screenshots */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {activeTab === 'overview' && (
          <OverviewSection showToast={showToast} />
        )}

        {activeTab === 'earnings' && (
          <EarningsSection showToast={showToast} />
        )}

        {activeTab === 'payouts' && (
          <PayoutsSection showToast={showToast} onOpenPayoutModal={() => { }} />
        )}

        {activeTab === 'profile' && (
          <SettingsSection showToast={showToast} />
        )}
      </main>

      {/* Toast Notifications */}
      <Toast message={toastMsg} />
    </div>
  );
}
