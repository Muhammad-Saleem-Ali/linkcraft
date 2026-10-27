'use client';
import React from 'react';
import { Download, Calendar, Globe, TrendingUp } from 'lucide-react';
export default function AdminReportsTab({ reports, showToast }) {
    if (!reports) {
        return (<div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #6366F1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}/>
        <p style={{ color: '#64748B', fontWeight: 600 }}>Loading revenue reports...</p>
      </div>);
    }
    const monthlyList = reports.monthly || [];
    const byCountryList = reports.byCountry || [];
    const topAffiliatesList = reports.topAffiliates || [];

    const totalPlatformRevenue = monthlyList.reduce((acc, m) => acc + (m.totalRevenue || 0), 0);
    const totalCommissionPaid = monthlyList.reduce((acc, m) => acc + (m.totalCommission || 0), 0);
    const totalItemsSold = monthlyList.reduce((acc, m) => acc + (m.totalShipped || 0), 0);

    const handleExportCSV = () => {
        if (monthlyList.length === 0) {
            showToast('No monthly data available to export.');
            return;
        }
        const csvContent = 'data:text/csv;charset=utf-8,' +
            'Month,Ordered,Shipped,Returned,Gross Revenue,Affiliate Commission\n' +
            monthlyList.map(m => `${m.month},${m.totalOrdered},${m.totalShipped},${m.totalReturned},${m.totalRevenue},${m.totalCommission}`).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `LinkCraft-Platform-Report-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Platform report exported as CSV!');
    };
    return (<div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
            Platform Revenue & Commission Reports
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
            Aggregated sales data across Amazon Associate global network and affiliates.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem' }}>
          <Download size={16}/>
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* 3 Summary Banners */}
      <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="ilearner-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Gross Amazon Item Sales
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: '0.375rem 0' }}>
            Rs. {totalPlatformRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.7813rem', color: '#64748B' }}>Total value of items ordered through affiliate links</span>
        </div>

        <div className="ilearner-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Affiliate Commissions
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', margin: '0.375rem 0' }}>
            Rs. {totalCommissionPaid.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.7813rem', color: '#64748B' }}>Net commission earnings distributed to partners</span>
        </div>

        <div className="ilearner-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Units Shipped by Amazon
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#4F46E5', margin: '0.375rem 0' }}>
            {totalItemsSold.toLocaleString()} units
          </div>
          <span style={{ fontSize: '0.7813rem', color: '#64748B' }}>Successful orders confirmed and fulfilled</span>
        </div>
      </div>

      {/* Monthly Report Table Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EEF2FF', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={18}/>
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Monthly Sales & Commission Performance
            </h3>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Complete month-by-month financial ledger</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Month</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Ordered</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Shipped</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Returns</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'right' }}>Gross Revenue</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'right' }}>Affiliate Cut</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {monthlyList.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>
                      No monthly reports available yet
                    </div>
                    <div style={{ fontSize: '0.8125rem' }}>
                      Aggregated Amazon Associates order records and commission settlements will appear here.
                    </div>
                  </td>
                </tr>
              ) : (
                monthlyList.map((row, idx) => (<tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 800, color: '#0F172A' }}>
                    {row.month}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center', fontWeight: 700 }}>
                    {row.totalOrdered}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#10B981' }}>
                    {row.totalShipped}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center', fontWeight: 700, color: row.totalReturned > 0 ? '#EF4444' : '#94A3B8' }}>
                    {row.totalReturned}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                    Rs. {row.totalRevenue.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 800, color: '#06B6D4' }}>
                    Rs. {row.totalCommission.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                    <span style={{
                padding: '0.2rem 0.625rem',
                borderRadius: '99px',
                backgroundColor: row.status === 'Pending' ? '#FEF3C7' : '#ECFDF5',
                color: row.status === 'Pending' ? '#B45309' : '#047857',
                fontSize: '0.75rem',
                fontWeight: 700,
            }}>
                      {row.status || 'Settled'}
                    </span>
                  </td>
                </tr>))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Grid: Country Breakdown & Top Affiliates */}
      <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Country Breakdown Card */}
        <div className="ilearner-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ECFEFF', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={18}/>
            </div>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Revenue by Amazon Marketplace
              </h3>
              <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Breakdown across regions</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {byCountryList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>
                  No regional order data yet
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  Orders across Amazon US, UK, and other marketplaces will appear here.
                </div>
              </div>
            ) : (
              byCountryList.map((item, idx) => (<div key={idx} style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0F172A' }}>
                    <span>{item.country === 'US' ? '🇺🇸' : item.country === 'UK' ? '🇬🇧' : '🌐'}</span>
                    <span>{item.country === 'US' ? 'United States (.com)' : item.country === 'UK' ? 'United Kingdom (.co.uk)' : item.country}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {item.ordersCount} purchase transactions tracked
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>
                    Rs. {item.revenue.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 700 }}>
                    Rs. {item.commission.toLocaleString()} comm.
                  </span>
                </div>
              </div>))
            )}
          </div>
        </div>

        {/* Top Affiliate Drivers */}
        <div className="ilearner-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18}/>
            </div>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Top Affiliate Revenue Drivers
              </h3>
              <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Partners generating highest item sales</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topAffiliatesList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>
                  No partner order transactions yet
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  Partners with active sales conversions will be ranked here.
                </div>
              </div>
            ) : (
              topAffiliatesList.map((aff, idx) => (<div key={aff.id || idx} style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#0F172A' }}>{aff.name}</div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {aff.itemsSold} items sold through links
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#10B981', display: 'block' }}>
                    Rs. {aff.revenueGenerated.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Rs. {aff.commissionEarned.toLocaleString()} earned
                  </span>
                </div>
              </div>))
            )}
          </div>
        </div>
      </div>
    </div>);
}
