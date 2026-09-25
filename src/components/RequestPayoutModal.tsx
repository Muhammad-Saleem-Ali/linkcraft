'use client';

import React, { useState } from 'react';
import { X, DollarSign, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
  availableBalance: string;
}

export default function RequestPayoutModal({
  isOpen,
  onClose,
  showToast,
  availableBalance,
}: RequestPayoutModalProps) {
  const [amount, setAmount] = useState('1840.50');
  const [method, setMethod] = useState('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Requested payout of $${amount} via ${method.toUpperCase()}. Reference #PO-${Math.floor(10000 + Math.random() * 90000)}`);
      onClose();
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 19, 43, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade-in"
        style={{ width: '100%', maxWidth: '460px', padding: '2rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1.25rem',
            top: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--brand-text-subtle)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.625rem', borderRadius: '12px', backgroundColor: 'var(--brand-success-bg)' }}>
            <Wallet size={24} color="var(--brand-success)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Request Balance Payout</h3>
            <p style={{ fontSize: '0.8438rem', color: 'var(--brand-text-muted)' }}>
              Available balance ready for instant transfer
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'var(--brand-bg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: 'var(--brand-text-muted)', fontWeight: 600 }}>
              Cleared Balance
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-success)' }}>
              {availableBalance}
            </span>
          </div>

          <div className="input-group">
            <label className="input-label">Withdrawal Amount ($)</label>
            <input
              type="number"
              step="0.01"
              max="1840.50"
              min="50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Select Payout Destination</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="input-field"
            >
              <option value="stripe">Stripe Direct Deposit (Chase **** 4819)</option>
              <option value="paypal">PayPal (jane.doe@partner.dev)</option>
              <option value="wire">Direct Wire Transfer</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1 }}>
              {isSubmitting ? 'Processing...' : 'Confirm Payout'}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
