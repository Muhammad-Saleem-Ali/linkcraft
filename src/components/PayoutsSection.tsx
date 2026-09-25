'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Eye,
  CheckCircle2,
  ChevronDown,
  Clock,
  X,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface PayoutsSectionProps {
  showToast: (msg: string) => void;
  onOpenPayoutModal: () => void;
}

export default function PayoutsSection({ showToast }: PayoutsSectionProps) {
  const [activeHistoryFilter, setActiveHistoryFilter] = useState('all');
  const [showPayoutsGuide, setShowPayoutsGuide] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Month breakdown list matching screenshots 1 & 2
  const monthBreakdown = [
    {
      month: 'September 2026',
      status: 'Awaiting Amazon',
      statusType: 'warning',
      amount: 'Rs. 1,958',
      countries: null,
    },
    {
      month: 'August 2026',
      status: 'Awaiting Amazon',
      statusType: 'warning',
      amount: 'Rs. 1,572',
      countries: null,
    },
    {
      month: 'July 2026',
      status: 'Paid',
      statusType: 'success',
      amount: 'Rs. 7,860',
      countries: '🇫🇷 🇬🇧 🇺🇸 3 countries',
    },
    {
      month: 'June 2026',
      status: 'Paid',
      statusType: 'success',
      amount: 'Rs. 6,188',
      countries: '🇩🇪 🇺🇸 2 countries',
    },
  ];

  // Payment transactions history list matching screenshot 2
  const transactions = [
    {
      id: 'tx-1',
      payoutTag: 'PAYOUT#202',
      amount: 'Rs. 7,860',
      status: 'Paid',
      date: 'Sep 1, 2026',
      flags: '🇫🇷 🇬🇧 🇺🇸',
      covers: 'Covers July 2026',
      receiptTitle: 'Payout receipt — 2026-07',
    },
    {
      id: 'tx-2',
      payoutTag: 'PAYOUT#202',
      amount: 'Rs. 6,188',
      status: 'Paid',
      date: 'Aug 2, 2026',
      flags: '🇺🇸 🇩🇪',
      covers: 'Covers June 2026',
      receiptTitle: 'Payout receipt — 2026-06',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      
      {/* 1. Breadcrumb */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
        <span style={{ color: '#9CA3AF' }}>Home</span>
        <span>›</span>
        <span style={{ color: '#9CA3AF' }}>Dashboard</span>
        <span>›</span>
        <span style={{ color: '#1E1B4B', fontWeight: 700 }}>Payouts</span>
      </div>

      {/* 2. PAID TO YOUR BANK Header Card (Screenshot 1) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #06B6D4 100%)',
          color: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          boxShadow: 'var(--brand-shadow-lg)',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', opacity: 0.9 }}>
          PAID TO YOUR BANK
        </span>
        <div style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0.25rem 0 0.375rem' }}>
          Rs. 14,048
        </div>
        <span style={{ fontSize: '0.8438rem', opacity: 0.85, display: 'block', marginBottom: '1.75rem' }}>
          Since Jun 2026 • last payment September 1
        </span>

        {/* 3 Metrics Footer inside Purple Card */}
        <div style={{ display: 'flex', gap: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, letterSpacing: '0.05em', opacity: 0.85 }}>THIS YEAR</span>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, marginTop: '0.125rem' }}>14,048</div>
          </div>

          <div>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, letterSpacing: '0.05em', opacity: 0.85 }}>AVG / MONTH</span>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, marginTop: '0.125rem' }}>4,683</div>
          </div>

          <div>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, letterSpacing: '0.05em', opacity: 0.85 }}>ON THE WAY</span>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, marginTop: '0.125rem' }}>0</div>
          </div>
        </div>
      </div>

      {/* 3. Your Earnings By Month Card (Screenshot 1 & 2) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} color="#06B6D4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A' }}>Your earnings by month</h3>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Tap any month for the full story</span>
          </div>
        </div>

        {/* Month Rows List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {monthBreakdown.map((row, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.125rem 1.25rem',
                borderRadius: '14px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E1B4B' }}>{row.month}</span>
                  {row.statusType === 'warning' ? (
                    <span style={{ padding: '0.2rem 0.625rem', borderRadius: '99px', backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 700 }}>
                      Awaiting Amazon
                    </span>
                  ) : (
                    <span style={{ padding: '0.2rem 0.625rem', borderRadius: '99px', backgroundColor: '#ECFDF5', color: '#047857', fontSize: '0.75rem', fontWeight: 700 }}>
                      Paid
                    </span>
                  )}
                </div>
                {row.countries && (
                  <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{row.countries}</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>{row.amount}</span>
                <ChevronDown size={18} color="#9CA3AF" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Payment History Section (Screenshot 2) */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Download size={20} color="#06B6D4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A' }}>Payment history</h3>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Actual transactions to your bank, newest first</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveHistoryFilter('all')}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '99px',
              border: activeHistoryFilter === 'all' ? '2px solid #06B6D4' : '1px solid #E2E8F0',
              backgroundColor: activeHistoryFilter === 'all' ? '#ECFEFF' : '#FFFFFF',
              color: activeHistoryFilter === 'all' ? '#0891B2' : '#475569',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            All • 2
          </button>
          <button
            onClick={() => setActiveHistoryFilter('paid')}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '99px',
              border: activeHistoryFilter === 'paid' ? '2px solid #06B6D4' : '1px solid #E2E8F0',
              backgroundColor: activeHistoryFilter === 'paid' ? '#ECFEFF' : '#FFFFFF',
              color: activeHistoryFilter === 'paid' ? '#0891B2' : '#475569',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Paid • 2
          </button>
          <button
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '99px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#9CA3AF',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            Pending • 0
          </button>
          <button
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '99px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#9CA3AF',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            Cancelled • 0
          </button>
        </div>

        {/* Transactions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {transactions.map((tx) => (
            <div
              key={tx.id}
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1E1B4B' }}>{tx.amount}</span>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '99px', backgroundColor: '#ECFDF5', color: '#047857', fontSize: '0.725rem', fontWeight: 700 }}>
                      {tx.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span>{tx.flags}</span>
                    <span>•</span>
                    <span>{tx.covers}</span>
                    <span style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '0.725rem', fontWeight: 600, color: '#6B7280' }}>
                      {tx.payoutTag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedReceipt(tx.receiptTitle)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#06B6D4',
                    cursor: 'pointer',
                  }}
                  title="View Receipt"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => showToast(`Downloaded PNG receipt for ${tx.receiptTitle}`)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#06B6D4',
                    cursor: 'pointer',
                  }}
                  title="Download Receipt"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. How your payouts work Collapsible Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div
          onClick={() => setShowPayoutsGuide(!showPayoutsGuide)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: showPayoutsGuide ? '1.25rem' : 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#06B6D4" />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A' }}>How your payouts work</h3>
          </div>
          <ChevronDown size={20} color="#64748B" style={{ transform: showPayoutsGuide ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>

        {showPayoutsGuide && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Filter Pills Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ padding: '0.375rem 0.875rem', borderRadius: '99px', border: '1.5px solid #06B6D4', backgroundColor: '#06B6D4', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 700 }}>
                Amazon
              </span>
              <span style={{ padding: '0.375rem 0.875rem', borderRadius: '99px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '0.8125rem', fontWeight: 600 }}>
                Referrer
              </span>
              <span style={{ padding: '0.375rem 0.875rem', borderRadius: '99px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '0.8125rem', fontWeight: 600 }}>
                Walmart
              </span>
              <span style={{ padding: '0.375rem 0.875rem', borderRadius: '99px', border: '1px solid #F59E0B', backgroundColor: '#FFFBEB', color: '#B45309', fontSize: '0.8125rem', fontWeight: 700 }}>
                Your delay • 30 days
              </span>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#047857', fontWeight: 800, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  1
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>You earn</h4>
                  <p style={{ fontSize: '0.8438rem', color: '#64748B', marginTop: '0.125rem' }}>
                    Someone buys through your link.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#FFFBEB', color: '#B45309', fontWeight: 800, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  2
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>Amazon processes (~30 days for you)</h4>
                  <p style={{ fontSize: '0.8438rem', color: '#64748B', marginTop: '0.125rem' }}>
                    Amazon releases the funds to us on your configured delay. Most affiliates run at 60 days; yours may be different if admin set a custom schedule.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ECFEFF', color: '#0891B2', fontWeight: 800, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  3
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>You get paid</h4>
                  <p style={{ fontSize: '0.8438rem', color: '#64748B', marginTop: '0.125rem' }}>
                    Direct bank transfer, with a receipt you can download.
                  </p>
                </div>
              </div>
            </div>

            {/* Example Grey Card */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                color: '#334155',
                fontSize: '0.8438rem',
                lineHeight: 1.5,
              }}
            >
              <strong>Example, using your 30-day delay.</strong> Sales in January → Amazon pays us end of February → You get PKR in your bank early March.
            </div>
          </div>
        )}
      </div>

      {/* 6. Receipt Modal Popup */}
      {selectedReceipt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="ilearner-card animate-fade-in"
            style={{ width: '100%', maxWidth: '440px', padding: '1.75rem', backgroundColor: '#FFFFFF', borderRadius: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                {selectedReceipt}
              </h3>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    showToast('Downloaded PNG receipt!');
                    setSelectedReceipt(null);
                  }}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #06B6D4',
                    backgroundColor: '#ECFEFF',
                    color: '#0891B2',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Download PNG
                </button>

                <button
                  onClick={() => setSelectedReceipt(null)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: '#4B5563',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Receipt Content Box */}
            <div
              style={{
                width: '100%',
                height: '140px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                color: '#374151',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              <ImageIcon size={24} color="#6B7280" />
              <span>Receipt 1</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: '2rem', padding: '1.5rem 0', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8125rem', borderTop: '1px solid #E5E7EB' }}>
        © 2026 LinkCraft. All rights reserved.
      </footer>
    </div>
  );
}
