'use client';

import React, { useState } from 'react';
import {
  User,
  Camera,
  CheckSquare,
  CreditCard,
  MessageCircle,
  Globe,
  Lock,
  Settings as SettingsIcon,
  ChevronDown,
  Info,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface SettingsSectionProps {
  showToast: (msg: string) => void;
}

export default function SettingsSection({ showToast }: SettingsSectionProps) {
  const [fullName, setFullName] = useState('Ahmar');
  const [phone, setPhone] = useState('');
  const [email] = useState('hafizahmar050@gmail.com');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [iban, setIban] = useState('');
  const [storeSlug, setStoreSlug] = useState('hka');
  const [isPageLive, setIsPageLive] = useState(true);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Personal information updated successfully!');
  };

  const handleSavePayout = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Payout method saved successfully!');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      
      {/* 1. Breadcrumb */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
        <span style={{ color: '#9CA3AF' }}>Home</span>
        <span>›</span>
        <span style={{ color: '#9CA3AF' }}>Dashboard</span>
        <span>›</span>
        <span style={{ color: '#1E1B4B', fontWeight: 700 }}>Profile</span>
      </div>

      {/* 2. Profile Header Banner Card (Bright Purple #7C00FF) (Screenshot 1) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #06B6D4 100%)',
          color: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          boxShadow: 'var(--brand-shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Avatar Box with Camera Overlay */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                color: '#FFFFFF',
                border: '2px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              A
            </div>
            <button
              onClick={() => showToast('Update profile photo')}
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: 'none',
                color: '#06B6D4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              <Camera size={14} />
            </button>
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Ahmar</h2>
            <span style={{ fontSize: '0.875rem', opacity: 0.9, display: 'block', marginBottom: '0.625rem' }}>
              {email}
            </span>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.25rem 0.625rem', borderRadius: '99px', backgroundColor: 'rgba(255, 255, 255, 0.18)', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Info size={12} /> Verify phone
              </span>
              <span style={{ padding: '0.25rem 0.625rem', borderRadius: '99px', backgroundColor: 'rgba(255, 255, 255, 0.18)', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Info size={12} /> Add bank
              </span>
              <span style={{ padding: '0.25rem 0.625rem', borderRadius: '99px', backgroundColor: 'rgba(255, 255, 255, 0.18)', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Info size={12} /> Enable 2FA
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metrics Footer */}
        <div style={{ display: 'flex', gap: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, letterSpacing: '0.05em', opacity: 0.85 }}>COMMISSION</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.125rem' }}>70%</div>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>of net ad fees</span>
          </div>

          <div>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, letterSpacing: '0.05em', opacity: 0.85 }}>MEMBER SINCE</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.125rem' }}>Jun 2026</div>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>3 months</span>
          </div>

          <div>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, letterSpacing: '0.05em', opacity: 0.85 }}>LINKED</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.125rem' }}>1 / 5</div>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>WhatsApp accounts</span>
          </div>
        </div>
      </div>

      {/* 3. "Get ready for payouts" Progress Card (Screenshot 1) */}
      <div
        style={{
          backgroundColor: '#FEFCE8',
          border: '1px solid #FEF08A',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF08A', color: '#854D0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={18} />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1E1B4B' }}>Get ready for payouts</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#854D0E' }}>3 of 5</span>
            <ChevronDown size={18} color="#854D0E" />
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '8px', backgroundColor: '#FEF08A', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '100%', backgroundColor: '#F59E0B', borderRadius: '99px' }} />
        </div>
      </div>

      {/* 4. "Personal information" Card (Screenshot 1 & 2) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="#7C00FF" />
          </div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>Personal information</h3>
        </div>

        <form onSubmit={handleSaveInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ color: '#4B5563' }}>Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
                style={{ borderRadius: '10px' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ color: '#4B5563' }}>Phone number</label>
              <input
                type="text"
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label" style={{ color: '#4B5563' }}>Email</label>
            <input
              type="email"
              disabled
              value={email}
              className="input-field"
              style={{ backgroundColor: '#F3F4F6', color: '#6B7280', borderRadius: '10px' }}
            />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
              Email can't be changed. Contact support if you need it updated.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-purple" style={{ padding: '0.625rem 1.25rem', borderRadius: '10px' }}>
              Save changes
            </button>
          </div>
        </form>
      </div>

      {/* 5. "Payout method" Card (Screenshot 2) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} color="#7C00FF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>Payout method</h3>
              <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Where we send your commissions</span>
            </div>
          </div>

          <span style={{ padding: '0.2rem 0.625rem', borderRadius: '99px', backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 700 }}>
            Incomplete
          </span>
        </div>

        <form onSubmit={handleSavePayout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ color: '#4B5563' }}>Bank / Wallet</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="input-field"
                style={{ borderRadius: '10px' }}
              >
                <option value="">Select a bank...</option>
                <option value="mcb">MCB Bank</option>
                <option value="hbl">Habib Bank Limited (HBL)</option>
                <option value="meezan">Meezan Bank</option>
                <option value="easypaisa">Easypaisa Wallet</option>
                <option value="jazzcash">JazzCash Wallet</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ color: '#4B5563' }}>Account title</label>
              <input
                type="text"
                placeholder="As on your bank account"
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                className="input-field"
                style={{ borderRadius: '10px' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ color: '#4B5563' }}>IBAN</label>
              <input
                type="text"
                placeholder="PK . . ."
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="input-field"
                style={{ borderRadius: '10px' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                24-character Pakistan IBAN starting with PK.
              </span>
            </div>
          </div>

          {/* Info Banner */}
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#F4E8FF',
              color: '#7C00FF',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Info size={16} />
            <span>You earn <strong>70%</strong> of net ad fees on your links. Payouts arrive after each month's commissions clear.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-purple" style={{ padding: '0.625rem 1.25rem', borderRadius: '10px' }}>
              Save payout method
            </button>
          </div>
        </form>
      </div>

      {/* 6. "WhatsApp accounts" Card (Screenshot 2 & 3) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={20} color="#00C875" fill="#00C875" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>WhatsApp accounts</h3>
              <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Link once — send Amazon URLs, get commissions</span>
            </div>
          </div>

          <span style={{ padding: '0.2rem 0.625rem', borderRadius: '99px', backgroundColor: '#F3E8FF', color: '#7C00FF', fontSize: '0.75rem', fontWeight: 700 }}>
            1 / 5 linked
          </span>
        </div>

        {/* Linked Account Box */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '14px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#00C875', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={20} color="#FFFFFF" fill="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#1E1B4B' }}>
                ❤️ Ahmar Pmm 8
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                161332...@lid • Linked Jul 31, 2026
              </span>
            </div>
          </div>

          <button
            onClick={() => showToast('Unlinked WhatsApp account')}
            style={{ border: 'none', background: 'none', color: '#DC2626', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
          >
            Unlink
          </button>
        </div>

        {/* Add another WhatsApp account button */}
        <div
          onClick={() => showToast('Opening WhatsApp link dialog...')}
          style={{
            padding: '1rem',
            borderRadius: '14px',
            border: '2px dashed #D8B4FE',
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#7C00FF', display: 'block' }}>
            + Link another WhatsApp account
          </span>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>4 slots remaining</span>
        </div>
      </div>

      {/* 7. "Public store page" Card (Screenshot 3) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={20} color="#7C00FF" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>Public store page</h3>
            <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>A single link to share your curated products</span>
          </div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E1B4B', marginBottom: '0.375rem' }}>Public store page</h4>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Get a personal page you can share with your audience. They'll see your latest products, and you can choose whether to roll your day's, yesterday's, or this week's links.
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Your URL</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace', color: '#1E1B4B' }}>
                https://ilearner.dev/u/{storeSlug}
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://ilearner.dev/u/${storeSlug}`);
                    showToast('Copied public store URL!');
                  }}
                  style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                >
                  Copy link
                </button>
                <button
                  onClick={() => showToast('Slug edit dialog')}
                  style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                >
                  Change slug
                </button>
              </div>
            </div>
          </div>

          {/* Status Box */}
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#047857' }}>
              ✓ Your page is live. Anyone with the link can view it.
            </span>

            <button
              onClick={() => {
                setIsPageLive(!isPageLive);
                showToast(isPageLive ? 'Public page disabled' : 'Public page is live!');
              }}
              style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid #FCA5A5', backgroundColor: '#FFFFFF', color: '#DC2626', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Disable page
            </button>
          </div>
        </div>
      </div>

      {/* 8. "Security" Card (Screenshot 4) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={20} color="#7C00FF" />
          </div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>Security</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
          {/* Password Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <span style={{ color: '#6B7280', width: '100px' }}>Password</span>
              <span style={{ color: '#1E1B4B', fontWeight: 600 }}>Set a strong password</span>
            </div>
            <button onClick={() => showToast('Change password dialog')} style={{ border: 'none', background: 'none', color: '#7C00FF', fontWeight: 700, cursor: 'pointer' }}>
              Change
            </button>
          </div>

          {/* Two Factor Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <span style={{ color: '#6B7280', width: '100px' }}>Two-factor</span>
              <span style={{ padding: '0.15rem 0.5rem', borderRadius: '99px', backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 700 }}>
                Not enabled
              </span>
              <span style={{ color: '#6B7280' }}>Authenticator app</span>
            </div>
            <button onClick={() => showToast('Enable 2FA dialog')} style={{ border: 'none', background: 'none', color: '#7C00FF', fontWeight: 700, cursor: 'pointer' }}>
              Enable
            </button>
          </div>

          {/* Sign Out Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <span style={{ color: '#6B7280', width: '100px' }}>Sign out</span>
              <span style={{ color: '#6B7280' }}>End every logged-in session, including this one</span>
            </div>
            <button onClick={() => showToast('Signed out all sessions')} style={{ border: 'none', background: 'none', color: '#7C00FF', fontWeight: 700, cursor: 'pointer' }}>
              Sign out all
            </button>
          </div>
        </div>
      </div>

      {/* 9. "Preferences" Card (Screenshot 4) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SettingsIcon size={20} color="#7C00FF" />
          </div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>Preferences</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span style={{ color: '#6B7280' }}>Shared link opens</span>
            <span style={{ color: '#1E1B4B', fontWeight: 600 }}>Direct Amazon URL</span>
          </div>
          <button onClick={() => showToast('Change preferences')} style={{ border: 'none', background: 'none', color: '#7C00FF', fontWeight: 700, cursor: 'pointer' }}>
            Change
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: '2rem', padding: '1.5rem 0', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8125rem', borderTop: '1px solid #E5E7EB' }}>
        © 2026 LinkCraft. All rights reserved.
      </footer>
    </div>
  );
}
