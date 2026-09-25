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
  const [isPayoutChecklistOpen, setIsPayoutChecklistOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // WhatsApp pairing code state & countdown timer
  const [showPairingBox, setShowPairingBox] = useState(false);
  const [pairingCode, setPairingCode] = useState('5FFN56');
  const [timerSeconds, setTimerSeconds] = useState(113);
  const [linkedAccounts, setLinkedAccounts] = useState([
    { id: 'wa-1', name: '❤️ Ahmar Pmm', tag: '8', lid: '161332...@lid', date: 'Linked Jul 31, 2026' }
  ]);

  // Dynamic Checkmarks calculation based on filled details
  const isNameFilled = fullName.trim().length > 0;
  const isPhoneFilled = phone.trim().length > 0;
  const isBankFilled = selectedBank.length > 0 || accountTitle.trim().length > 0 || iban.trim().length > 0;
  const isWhatsAppLinked = linkedAccounts.length > 0;

  const completedCount = [
    isNameFilled,
    isPhoneFilled,
    isBankFilled,
    is2FAEnabled,
    isWhatsAppLinked,
  ].filter(Boolean).length;

  const progressPercent = (completedCount / 5) * 100;

  // Countdown timer effect for active pairing code
  React.useEffect(() => {
    if (!showPairingBox || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showPairingBox, timerSeconds]);

  const handleGeneratePairingCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPairingCode(code);
    setTimerSeconds(120);
    setShowPairingBox(true);
    showToast(`Generated pairing code: ${code}!`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

      {/* 3. "Get ready for payouts" Collapsible Accordion Card (Screenshot 1) */}
      <div
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '20px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--brand-shadow-sm)',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Accordion Header Trigger */}
        <div
          onClick={() => setIsPayoutChecklistOpen(!isPayoutChecklistOpen)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={20} />
            </div>
            <div>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>
                Get ready for payouts
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#B45309' }}>
                Finish these before your first payout is due
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.2rem 0.625rem', borderRadius: '99px' }}>
              {completedCount} of 5
            </span>
            <ChevronDown
              size={20}
              color="#D97706"
              style={{ transform: isPayoutChecklistOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
            />
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{ width: '100%', height: '8px', backgroundColor: '#FEF3C7', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
        </div>

        {/* Accordion Body (Collapsible, hidden by default) */}
        {isPayoutChecklistOpen && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginTop: '0.5rem', borderTop: '1px solid #FDE68A', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
              Finish these before your first payout is due
            </span>

            {/* Item 1: Name */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isNameFilled ? (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    ✓
                  </div>
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px dashed #F59E0B', backgroundColor: 'transparent' }} />
                )}
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Add your name</span>
                  <span style={{ fontSize: '0.7813rem', color: '#64748B', display: 'block' }}>{fullName || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Item 2: Phone */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isPhoneFilled ? (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    ✓
                  </div>
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px dashed #F59E0B', backgroundColor: 'transparent' }} />
                )}
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Add your phone number</span>
                  <span style={{ fontSize: '0.7813rem', color: '#64748B', display: 'block' }}>{phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Item 3: Bank / Wallet */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isBankFilled ? (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    ✓
                  </div>
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px dashed #F59E0B', backgroundColor: 'transparent' }} />
                )}
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Set up your bank / wallet</span>
                  <span style={{ fontSize: '0.7813rem', color: '#64748B', display: 'block' }}>
                    {selectedBank ? `${selectedBank.toUpperCase()} Bank` : 'Not configured'}
                  </span>
                </div>
              </div>
              {!isBankFilled && (
                <button
                  onClick={() => showToast('Scroll down to fill your payout bank details')}
                  style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Set up ›
                </button>
              )}
            </div>

            {/* Item 4: 2FA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {is2FAEnabled ? (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    ✓
                  </div>
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px dashed #F59E0B', backgroundColor: 'transparent' }} />
                )}
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Turn on two-factor authentication</span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Optional but strongly recommended</span>
                </div>
              </div>
              {!is2FAEnabled && (
                <button
                  onClick={() => {
                    setIs2FAEnabled(true);
                    showToast('Enabled 2FA authentication!');
                  }}
                  style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Set up ›
                </button>
              )}
            </div>

            {/* Item 5: WhatsApp */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isWhatsAppLinked ? (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    ✓
                  </div>
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px dashed #F59E0B', backgroundColor: 'transparent' }} />
                )}
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Link your WhatsApp account</span>
                </div>
              </div>
            </div>
          </div>
        )}
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

      {/* 6. "WhatsApp accounts" Card (Screenshot 2) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={20} color="#10B981" fill="#10B981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A' }}>WhatsApp accounts</h3>
              <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Link once — send Amazon URLs, get commissions</span>
            </div>
          </div>

          <span style={{ padding: '0.2rem 0.625rem', borderRadius: '99px', backgroundColor: '#ECFEFF', color: '#0891B2', fontSize: '0.75rem', fontWeight: 700 }}>
            {linkedAccounts.length} / 5 linked
          </span>
        </div>

        {/* Linked Accounts List */}
        {linkedAccounts.map((acc) => (
          <div
            key={acc.id}
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '14px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={20} color="#FFFFFF" fill="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span>{acc.name}</span>
                  <span style={{ fontSize: '0.6875rem', backgroundColor: '#E2E8F0', padding: '0.1rem 0.375rem', borderRadius: '4px', color: '#475569' }}>{acc.tag}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {acc.lid} • {acc.date}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setLinkedAccounts(linkedAccounts.filter((a) => a.id !== acc.id));
                showToast('Unlinked WhatsApp account');
              }}
              style={{ border: 'none', background: 'none', color: '#EF4444', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
            >
              Unlink
            </button>
          </div>
        ))}

        {/* "+ Link another WhatsApp account" Button Card */}
        {!showPairingBox && (
          <div
            onClick={handleGeneratePairingCode}
            style={{
              padding: '1.25rem',
              borderRadius: '14px',
              border: '2px dashed #06B6D4',
              backgroundColor: '#ECFEFF',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.15s, background-color 0.2s',
            }}
          >
            <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0891B2', display: 'block', marginBottom: '0.25rem' }}>
              + Link another WhatsApp account
            </span>
            <span style={{ fontSize: '0.7813rem', color: '#64748B' }}>
              {5 - linkedAccounts.length} slots remaining • Click to generate 6-digit WhatsApp pairing code
            </span>
          </div>
        )}

        {/* Dark Navy Pairing Verification Box (Revealed dynamically when user clicks Link another WhatsApp) */}
        {showPairingBox && (
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
              marginTop: '1rem',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.35em', fontFamily: 'monospace', color: '#FFFFFF' }}>
                {pairingCode.split('').join(' ')}
              </div>
              <span style={{ fontSize: '0.8125rem', color: timerSeconds > 0 ? '#94A3B8' : '#EF4444', fontWeight: 600 }}>
                {timerSeconds > 0 ? `Expires in ${formatTimer(timerSeconds)}` : 'Code expired'}
              </span>
            </div>

            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              <li>Open WhatsApp on your phone and message our bot <strong>+92 3181494914</strong>.</li>
              <li>Send the code <strong>{pairingCode}</strong> as your first message.</li>
              <li>Once linked, share any Amazon URL and we'll track it automatically.</li>
            </ol>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
              {timerSeconds > 0 ? (
                <a
                  href={`https://wa.me/923181494914?text=${pairingCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-emerald"
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.9375rem' }}
                >
                  <MessageCircle size={18} fill="#FFFFFF" />
                  <span>Open WhatsApp</span>
                </a>
              ) : (
                <button
                  onClick={handleGeneratePairingCode}
                  className="btn-amber"
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.9375rem' }}
                >
                  <span>Generate New Code</span>
                </button>
              )}

              <button
                onClick={() => setShowPairingBox(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. "Public store page" Card (Screenshot 3) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={20} color="#06B6D4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A' }}>Public store page</h3>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>A single link to share your curated products</span>
          </div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.375rem' }}>Public store page</h4>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Get a personal page you can share with your audience. They'll see your latest products, and you can choose whether to roll your day's, yesterday's, or this week's links.
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Your URL</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace', color: '#0F172A' }}>
                https://linkcraft.dev/u/{storeSlug}
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://linkcraft.dev/u/${storeSlug}`);
                    showToast('Copied public store URL!');
                  }}
                  className="btn-secondary btn-sm"
                >
                  <Copy size={14} />
                  Copy link
                </button>
                <a
                  href={`/u/${storeSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-teal btn-sm"
                >
                  <ExternalLink size={14} />
                  View Store Page
                </a>
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
              flexWrap: 'wrap',
              gap: '0.75rem',
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
              style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid #FCA5A5', backgroundColor: '#FFFFFF', color: '#EF4444', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
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
