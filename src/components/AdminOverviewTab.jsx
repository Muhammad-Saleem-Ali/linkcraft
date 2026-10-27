'use client';
import React from 'react';
import { Users, Link2, AlertCircle, CheckCircle2, Clock, ArrowRight, Award, Sparkles } from 'lucide-react';
export default function AdminOverviewTab({ metrics, topPartners, onNavigateTab, showToast, }) {
    if (!metrics) {
        return (<div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #6366F1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}/>
        <p style={{ color: '#64748B', fontWeight: 600 }}>Loading platform analytics...</p>
      </div>);
    }
    return (<div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      
      {/* Top Banner Alert if Actions Needed */}
      {(metrics.pendingAffiliates > 0 || metrics.pendingPayoutsCount > 0) && (<div style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertCircle size={20}/>
            </div>
            <div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#92400E', display: 'block' }}>
                Action Items Awaiting Admin Review
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#B45309' }}>
                {metrics.pendingAffiliates > 0 && `${metrics.pendingAffiliates} pending partner approval${metrics.pendingAffiliates > 1 ? 's' : ''}`}
                {metrics.pendingAffiliates > 0 && metrics.pendingPayoutsCount > 0 && ' • '}
                {metrics.pendingPayoutsCount > 0 && `${metrics.pendingPayoutsCount} payout request (Rs. ${metrics.pendingPayoutsAmount.toLocaleString()}) ready for processing`}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {metrics.pendingAffiliates > 0 && (<button onClick={() => onNavigateTab('users')} className="btn-amber" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                Review Affiliates
              </button>)}
            {metrics.pendingPayoutsCount > 0 && (<button onClick={() => onNavigateTab('payouts')} className="btn-emerald" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                Approve Payouts
              </button>)}
          </div>
        </div>)}

      {/* 4 Primary KPI Cards */}
      <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* 1. Affiliates Breakdown */}
        <div className="ilearner-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366F1', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Affiliate Partners
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#EEF2FF', color: '#6366F1' }}>
              <Users size={18}/>
            </div>
          </div>

          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {metrics.totalAffiliates}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', fontWeight: 700 }}>
            <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ● {metrics.activeAffiliates} Active
            </span>
            <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ● {metrics.pendingAffiliates} Pending
            </span>
            <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ● {metrics.suspendedAffiliates} Suspended
            </span>
          </div>
        </div>

        {/* 2. Platform Traffic & Conversion */}
        <div className="ilearner-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#06B6D4', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Links & Clicks
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#ECFEFF', color: '#06B6D4' }}>
              <Link2 size={18}/>
            </div>
          </div>

          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {metrics.totalClicks.toLocaleString()}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', color: '#64748B' }}>
            <span><strong>{metrics.totalLinks}</strong> Active Links</span>
            <span style={{ fontWeight: 800, color: '#06B6D4' }}>{metrics.conversionRate} Conv.</span>
          </div>
        </div>

        {/* 3. Currently Owed (Commissions Due) */}
        <div className="ilearner-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Currently Owed
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#FFFBEB', color: '#F59E0B' }}>
              <Clock size={18}/>
            </div>
          </div>

          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#D97706', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Rs. {metrics.totalCurrentlyOwed.toLocaleString()}
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', color: '#64748B' }}>
            <span>Unpaid affiliate commissions across network</span>
          </div>
        </div>

        {/* 4. Total Paid Out */}
        <div className="ilearner-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Total Paid Out
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#10B981' }}>
              <CheckCircle2 size={18}/>
            </div>
          </div>

          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#059669', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Rs. {metrics.totalPaidOut.toLocaleString()}
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', color: '#64748B' }}>
            <span>Lifetime: <strong>Rs. {metrics.totalLifetimeEarnings.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Split Grid: Top Performers Leaderboard & System Status */}
      <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Top Affiliate Earners */}
        <div className="ilearner-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
                <Award size={18}/>
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A' }}>
                Top Performing Partners
              </h3>
            </div>
            <button onClick={() => onNavigateTab('users')} style={{ background: 'none', border: 'none', color: '#6366F1', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View All</span>
              <ArrowRight size={14}/>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {topPartners.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>
                  No partner activity recorded yet
                </div>
                <div style={{ fontSize: '0.8125rem' }}>
                  Top earning partners and click leaderboards will appear here as affiliate links generate traffic.
                </div>
              </div>
            ) : (
              topPartners.map((partner, index) => (<div key={partner.id} style={{
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: index === 0 ? '#FEF3C7' : '#F1F5F9',
                color: index === 0 ? '#D97706' : '#64748B',
                fontWeight: 800,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                    {index + 1}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>
                      {partner.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {partner.clicksCount} clicks • {partner.linksCount} links
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#10B981', display: 'block' }}>
                    Rs. {partner.lifetimeEarnings.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600 }}>
                    Rs. {partner.currentlyOwed.toLocaleString()} due
                  </span>
                </div>
              </div>))
            )}
          </div>
        </div>

        {/* Right Column: Platform Engine Status & Architecture */}
        <div className="ilearner-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#ECFEFF', color: '#06B6D4' }}>
                <Sparkles size={18}/>
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A' }}>
                System & Database Status
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.8438rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Database Engine</span>
                <span style={{ fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}/>
                  PostgreSQL 16 Native (:5433)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Backend Service</span>
                <span style={{ fontWeight: 700, color: '#0891B2', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06B6D4' }}/>
                  Node.js Express (:5000)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Frontend Application</span>
                <span style={{ fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366F1' }}/>
                  Next.js 16 Client
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Amazon Associate Tracking Tag</span>
                <code style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#E2E8F0', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                  {metrics.amazonPartnerTag || 'linkcraft-20'}
                </code>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Need to audit all generated URLs?</span>
            <button onClick={() => onNavigateTab('links')} className="btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8125rem' }}>
              Audit Links
            </button>
          </div>
        </div>
      </div>
    </div>);
}
