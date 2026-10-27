'use client';
import React, { useState } from 'react';
import { X, Building } from 'lucide-react';
export default function AdminPayoutsTab({ payouts, onProcessPayout, showToast, }) {
    const [filter, setFilter] = useState('all');
    const [processingPayout, setProcessingPayout] = useState(null);
    const [receiptTitle, setReceiptTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const filtered = payouts.filter((p) => {
        if (filter !== 'all' && p.status !== filter)
            return false;
        return true;
    });
    const handleOpenProcessModal = (p) => {
        setProcessingPayout(p);
        setReceiptTitle(`Payout receipt — ${p.monthCovered}`);
    };
    const handleConfirmPay = async () => {
        if (!processingPayout)
            return;
        setIsSubmitting(true);
        try {
            await onProcessPayout(processingPayout.id, receiptTitle);
            showToast(`Payout ${processingPayout.payoutTag} of Rs. ${processingPayout.amount.toLocaleString()} marked as paid!`);
            setProcessingPayout(null);
        }
        catch (err) {
            showToast(err.message || 'Failed to process payout');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
            Affiliate Payout Approvals & History
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
            Process pending commission transfers, review bank details, and verify transaction receipts.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: '#FFFFFF', padding: '0.375rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          {['all', 'pending', 'paid'].map((st) => {
            const isActive = filter === st;
            const count = st === 'all' ? payouts.length : payouts.filter(p => p.status === st).length;
            return (<button key={st} onClick={() => setFilter(st)} style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? '#6366F1' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                }}>
                <span>{st}</span>
                <span style={{
                    fontSize: '0.6875rem',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#64748B',
                    padding: '0.1rem 0.375rem',
                    borderRadius: '99px',
                }}>
                  {count}
                </span>
              </button>);
        })}
        </div>
      </div>

      {/* Payouts Table Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Transaction / Tag</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Affiliate Partner</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Bank Account Details</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>
                      No payout records found
                    </div>
                    <div style={{ fontSize: '0.8125rem' }}>
                      Affiliate withdrawal requests and settlements will appear here.
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (<tr key={tx.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  
                  {/* Tag & Month */}
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{tx.payoutTag}</div>
                    <div style={{ fontSize: '0.7813rem', color: '#64748B', marginTop: '0.125rem' }}>
                      Covers {tx.monthCovered}
                    </div>
                  </td>

                  {/* Partner Name & Email */}
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{tx.partnerName}</div>
                    <div style={{ fontSize: '0.7813rem', color: '#64748B' }}>{tx.partnerEmail}</div>
                  </td>

                  {/* Bank Info */}
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Building size={14} color="#6366F1"/>
                      <span>{tx.bankName || 'Direct Transfer'}</span>
                    </div>
                    {tx.iban && (<div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748B', marginTop: '0.125rem' }}>
                        {tx.iban}
                      </div>)}
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 900, color: '#0F172A', fontSize: '1.0625rem' }}>
                    Rs. {tx.amount.toLocaleString()}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                    <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '99px',
                backgroundColor: tx.status === 'paid' ? '#ECFDF5' : '#FFFBEB',
                color: tx.status === 'paid' ? '#047857' : '#B45309',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
            }}>
                      {tx.status === 'paid' ? '✓ Paid' : '⏳ Pending Approval'}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                    {tx.status === 'pending' ? (<button onClick={() => handleOpenProcessModal(tx)} className="btn-emerald" style={{ padding: '0.375rem 0.875rem', fontSize: '0.7813rem' }}>
                        Process & Pay
                      </button>) : (<span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                        {tx.paidAt ? new Date(tx.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Completed'}
                      </span>)}
                  </td>
                </tr>)))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Payout Modal */}
      {processingPayout && (<div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
            }} onClick={() => setProcessingPayout(null)}>
          <div className="ilearner-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2rem', position: 'relative', borderRadius: '24px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setProcessingPayout(null)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
              <X size={20}/>
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.375rem' }}>
              Authorize Payout Transfer
            </h3>
            <p style={{ fontSize: '0.8438rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Confirm bank transfer to affiliate partner and issue receipt.
            </p>

            {/* Payout Summary Box */}
            <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Partner:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{processingPayout.partnerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Bank:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{processingPayout.bankName || 'MCB Bank'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>IBAN:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>{processingPayout.iban || 'PK36...'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0', fontSize: '1.125rem' }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>Amount to Transfer:</span>
                <span style={{ fontWeight: 900, color: '#10B981' }}>Rs. {processingPayout.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Receipt Title Field */}
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Receipt Reference Note</label>
              <input type="text" value={receiptTitle} onChange={(e) => setReceiptTitle(e.target.value)} className="input-field" style={{ fontSize: '0.875rem' }}/>
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleConfirmPay} disabled={isSubmitting} className="btn-emerald" style={{ flex: 1, padding: '0.75rem', fontSize: '0.9375rem' }}>
                {isSubmitting ? 'Recording Payout...' : 'Confirm & Mark as Paid'}
              </button>
              <button onClick={() => setProcessingPayout(null)} className="btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
