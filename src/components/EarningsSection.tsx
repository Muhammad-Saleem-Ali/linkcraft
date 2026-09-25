'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Calendar,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronRight,
  Play,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface EarningsSectionProps {
  showToast: (msg: string) => void;
}

export default function EarningsSection({ showToast }: EarningsSectionProps) {
  const [productUrl, setProductUrl] = useState('');
  const [activeMonthFilter, setActiveMonthFilter] = useState<'this' | 'last'>('this');
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [selectedCountry, setSelectedCountry] = useState('All countries');
  const [showHistory, setShowHistory] = useState(true);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return;
    showToast('Created tracking link!');
    setProductUrl('');
  };

  // Dynamic Chart Datasets for This Month vs Last Month
  const chartDataThisMonth = {
    labels: ['1', '6', '11', '16', '21', '26'],
    actualPoints: [
      { x: 50, y: 135, val: 'Rs. 0', date: 'Sep 1' },
      { x: 100, y: 135, val: 'Rs. 0', date: 'Sep 3' },
      { x: 140, y: 115, val: '+Rs 511', date: 'Sep 6' },
      { x: 180, y: 115, val: '+Rs 511', date: 'Sep 7' },
      { x: 220, y: 90, val: '+Rs 347', date: 'Sep 8' },
      { x: 260, y: 70, val: '+Rs 247', date: 'Sep 10' },
      { x: 300, y: 70, val: '+Rs 311', date: 'Sep 11' },
      { x: 340, y: 70, val: '+Rs 41', date: 'Sep 13 (Today)' },
    ],
    projectedPoints: [
      { x: 340, y: 70, val: 'Rs. 1,958' },
      { x: 520, y: 55, val: 'Rs. 3,450' },
      { x: 700, y: 45, val: 'Rs. 4,959 (Est.)' },
    ],
  };

  const chartDataLastMonth = {
    labels: ['1', '6', '11', '16', '21', '26', '31'],
    actualPoints: [
      { x: 50, y: 135, val: 'Rs. 0', date: 'Aug 1' },
      { x: 140, y: 120, val: '+Rs 200', date: 'Aug 6' },
      { x: 220, y: 95, val: '+Rs 450', date: 'Aug 11' },
      { x: 340, y: 75, val: '+Rs 820', date: 'Aug 16' },
      { x: 520, y: 60, val: '+Rs 1,200', date: 'Aug 24' },
      { x: 700, y: 50, val: 'Rs. 1,572 (Final)', date: 'Aug 31' },
    ],
    projectedPoints: [],
  };

  const currentChart = activeMonthFilter === 'this' ? chartDataThisMonth : chartDataLastMonth;

  // Earnings history day list
  const historyDays = [
    { day: 'Sun, 13 Sept', amount: '+Rs 41', isPositive: true },
    { day: 'Sat, 12 Sept', amount: '-Rs 39', isPositive: false },
    { day: 'Fri, 11 Sept', amount: '+Rs 311', isPositive: true },
    { day: 'Thu, 10 Sept', amount: '+Rs 247', isPositive: true },
    { day: 'Tue, 8 Sept', amount: '+Rs 347', isPositive: true },
    { day: 'Mon, 7 Sept', amount: '+Rs 511', isPositive: true },
    { day: 'Sun, 6 Sept', amount: '-Rs 22', isPositive: false },
    { day: 'Sat, 5 Sept', amount: '+Rs 50', isPositive: true },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      
      {/* 1. Breadcrumb */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
        <span style={{ color: '#9CA3AF' }}>Home</span>
        <span>›</span>
        <span style={{ color: '#9CA3AF' }}>Dashboard</span>
        <span>›</span>
        <span style={{ color: '#1E1B4B', fontWeight: 700 }}>Earnings</span>
      </div>

      {/* 2. Create Link Input Card */}
      <div className="ilearner-card" style={{ padding: '1.25rem 1.5rem' }}>
        <form onSubmit={handleCreateLink} className="create-link-form responsive-flex-column" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Paste an Amazon or Walmart product URL"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            className="input-field"
            style={{ borderRadius: '12px', fontSize: '0.9375rem', flex: 1 }}
          />
          <button type="submit" className="btn-purple" style={{ whiteSpace: 'nowrap', borderRadius: '12px' }}>
            Create link
          </button>
        </form>

        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
          <span style={{ color: '#6B7280' }}>or</span>
          <button
            onClick={() => showToast('Opening WhatsApp link generator...')}
            style={{
              background: 'none',
              border: 'none',
              color: '#10B981',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              cursor: 'pointer',
            }}
          >
            <MessageCircle size={16} fill="#10B981" color="#FFFFFF" />
            <span>create via WhatsApp</span>
          </button>
          <HelpCircle size={14} color="#9CA3AF" style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* 3. THIS MONTH — ACTUAL VS PROJECTED Card with Interactive Hover */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#06B6D4', letterSpacing: '0.05em' }}>
            {activeMonthFilter === 'this' ? 'THIS MONTH — ACTUAL VS PROJECTED' : 'LAST MONTH — FINAL EARNINGS'}
          </span>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '99px', backgroundColor: '#F1F5F9', color: '#64748B', fontWeight: 600 }}>
            {activeMonthFilter === 'this' ? 'Projection = estimate' : 'Finalized'}
          </span>
        </div>

        <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span>{activeMonthFilter === 'this' ? 'Rs. 1,958' : 'Rs. 1,572'}</span>
          <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>{activeMonthFilter === 'this' ? 'so far' : 'total'}</span>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
          {activeMonthFilter === 'this' ? (
            <>Projected to finish around <strong style={{ color: '#06B6D4' }}>Rs. 4,959</strong> <span style={{ color: '#64748B' }}>(Rs. 3,988 – Rs. 5,835)</span></>
          ) : (
            <>Finalized payout amount for August 2026: <strong style={{ color: '#10B981' }}>Rs. 1,572</strong></>
          )}
        </p>

        {/* SVG Chart for Actual vs Projected */}
        <div style={{ width: '100%', height: '180px', position: 'relative' }}>
          <svg width="100%" height="150" viewBox="0 0 700 150" preserveAspectRatio="none">
            {/* Grid lines */}
            {[20, 55, 90, 125].map((y, i) => (
              <line key={i} x1="50" y1={y} x2="700" y2={y} stroke="#F1F5F9" strokeDasharray="3 3" />
            ))}

            {/* Y axis labels */}
            <text x="5" y="25" fill="#94A3B8" fontSize="11">Rs. 6.0k</text>
            <text x="5" y="60" fill="#94A3B8" fontSize="11">Rs. 4.5k</text>
            <text x="5" y="95" fill="#94A3B8" fontSize="11">Rs. 3.0k</text>
            <text x="5" y="130" fill="#94A3B8" fontSize="11">Rs. 1.5k</text>
            <text x="18" y="148" fill="#94A3B8" fontSize="11">Rs. 0</text>

            {/* Vertical Today Reference Line (only for this month) */}
            {activeMonthFilter === 'this' && (
              <>
                <line x1="340" y1="10" x2="340" y2="135" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth="1.5" />
                <text x="325" y="8" fill="#6B7280" fontSize="11" fontWeight="700">Today</text>

                {/* Projected Shaded Area */}
                <path
                  d="M 340 110 L 700 30 L 700 80 L 340 110 Z"
                  fill="#06B6D4"
                  fillOpacity="0.1"
                />
              </>
            )}

            {/* Solid Green Actual Line */}
            <path
              d={currentChart.actualPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
            />

            {/* Dashed Teal Projected Line */}
            {activeMonthFilter === 'this' && (
              <path
                d="M 340 70 L 700 45"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
                strokeDasharray="5 5"
              />
            )}

            {/* Data Circles */}
            {currentChart.actualPoints.map((pt, index) => {
              const isHovered = hoveredPointIndex === index;
              return (
                <g key={index}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill="#FFFFFF"
                    stroke="#10B981"
                    strokeWidth={isHovered ? 3 : 2.5}
                    style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                    onMouseEnter={() => setHoveredPointIndex(index)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPointIndex !== null && currentChart.actualPoints[hoveredPointIndex] && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute',
                top: `${currentChart.actualPoints[hoveredPointIndex].y - 35}px`,
                left: `${currentChart.actualPoints[hoveredPointIndex].x}px`,
                transform: 'translateX(-50%)',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {currentChart.actualPoints[hoveredPointIndex].date}: {currentChart.actualPoints[hoveredPointIndex].val}
            </div>
          )}

          {/* X Axis ticks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '50px', marginTop: '0.25rem', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
            {currentChart.labels.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1rem', fontSize: '0.8125rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '16px', height: '3px', backgroundColor: '#00C875' }} />
            <span><strong style={{ color: '#1E1B4B' }}>Actual</strong> — earned so far</span>
          </div>

          {activeMonthFilter === 'this' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '16px', height: '0', borderTop: '2px dashed #7C00FF' }} />
                <span><strong style={{ color: '#1E1B4B' }}>Projected</strong> — estimate, not earned yet</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '14px', height: '14px', backgroundColor: 'rgba(124, 0, 255, 0.15)', borderRadius: '3px' }} />
                <span style={{ color: '#6B7280' }}>likely range</span>
              </div>
            </>
          )}
        </div>

        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.75rem' }}>
          The dashed line and shaded band are an estimate of where this month may finish — not money banked yet.
        </p>
      </div>

      {/* 4. Earnings Filters & Info Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E1B4B' }}>Earnings</h3>
        <p style={{ fontSize: '0.8438rem', color: '#6B7280', marginBottom: '1rem' }}>
          Select a month or country to filter
        </p>

        {/* Filter buttons bar */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
          <button
            onClick={() => {
              setActiveMonthFilter('this');
              setSelectedMonth('September 2026');
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeMonthFilter === 'this' ? '#7C00FF' : '#F3F4F6',
              color: activeMonthFilter === 'this' ? '#FFFFFF' : '#4B5563',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            This month
          </button>
          <button
            onClick={() => {
              setActiveMonthFilter('last');
              setSelectedMonth('August 2026');
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeMonthFilter === 'last' ? '#7C00FF' : '#F3F4F6',
              color: activeMonthFilter === 'last' ? '#FFFFFF' : '#4B5563',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Last month
          </button>

          <div style={{ position: 'relative' }}>
            <button
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1E1B4B',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <span>{selectedMonth}</span>
              <Calendar size={15} color="#6B7280" />
            </button>
          </div>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="input-field"
            style={{ width: 'auto', padding: '0.5rem 0.875rem', fontSize: '0.875rem', borderRadius: '10px' }}
          >
            <option>All countries</option>
            <option>United States 🇺🇸</option>
            <option>United Kingdom 🇬🇧</option>
          </select>

          <button
            onClick={() => showToast('Refreshed earnings data!')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} color="#6B7280" />
          </button>

          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F3E8FF',
              color: '#7C00FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            i
          </div>
        </div>

        {/* Info Box */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            backgroundColor: '#F0F9FF',
            border: '1px solid #BAE6FD',
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              flexShrink: 0,
            }}
          >
            i
          </div>

          <div style={{ fontSize: '0.8438rem', color: '#0369A1' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0C4A6E', marginBottom: '0.375rem' }}>
              How your earnings are tracked
            </h4>
            <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', lineHeight: 1.5 }}>
              <li><strong>Ordered</strong> = Someone clicked your link and bought it</li>
              <li><strong>Shipped</strong> = Amazon sent the item (you earn commission when this happens)</li>
              <li><strong>Returns</strong> = Customer returned it (commission is deducted)</li>
            </ul>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#0284C7' }}>
              Data refreshes twice a week. Earnings shown are estimates until Amazon finalizes them (~60 days).
            </p>
          </div>
        </div>

        {/* Donut Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E1B4B' }}>Your earnings by country</h4>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Your share</span>
            </div>
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#E5E7EB" strokeWidth="5" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#0284C7" strokeWidth="5" strokeDasharray="60 40" strokeDashoffset="25" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#00C875" strokeWidth="5" strokeDasharray="40 60" strokeDashoffset="85" />
              </svg>
            </div>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: '14px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E1B4B' }}>Your clicks by country</h4>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Amazon-reported</span>
            </div>
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#E5E7EB" strokeWidth="5" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#00C875" strokeWidth="5" strokeDasharray="75 25" strokeDashoffset="25" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#0284C7" strokeWidth="5" strokeDasharray="25 75" strokeDashoffset="100" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Six Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600 }}>Your Earnings</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284C7', margin: '0.25rem 0' }}>Rs. 1,958</div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Commission you've earned</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600 }}>Clicks</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284C7', margin: '0.25rem 0' }}>571</div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Amazon-reported clicks on your links</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600 }}>Ordered</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#00C875', margin: '0.25rem 0' }}>54</div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Purchases from your links</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600 }}>Shipped</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B', margin: '0.25rem 0' }}>50</div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>You earn when items ship</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600 }}>Returned</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EF4444', margin: '0.25rem 0' }}>4</div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Items customers returned</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600 }}>Returns Value</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EF4444', margin: '0.25rem 0' }}>Rs. 863</div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Commission deducted by returns</span>
        </div>
      </div>

      {/* 6. Earnings Details & Returns Tables */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B' }}>Earnings Details</h3>
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.375rem 0 1rem' }}>
          Each row shows a product sold through your links. Amazon may not itemize all sales — your total earnings above include cross-sells we cannot list here.
        </p>

        <div
          style={{
            padding: '1rem',
            borderRadius: '12px',
            backgroundColor: '#FEFCE8',
            border: '1px solid #FEF08A',
            color: '#854D0E',
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
          }}
        >
          <strong>Heads up:</strong> Per-product attribution is an estimate. Amazon doesn't tell us which exact link drove each sale, so we infer it from your reservations and our scoring rules. The totals above are accurate; individual rows may shift as we refine the model.
        </div>

        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8438rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Product</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Earned</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Your Cut</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Ordered</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Shipped</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Country</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>Other items sold</td>
                <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>Rs. 1,627</td>
                <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>Rs. 1,141</td>
                <td style={{ padding: '0.875rem 0.5rem' }}>17</td>
                <td style={{ padding: '0.875rem 0.5rem' }}>17</td>
                <td style={{ padding: '0.875rem 0.5rem', color: '#00C875', fontWeight: 600 }}>✓ Active</td>
                <td style={{ padding: '0.875rem 0.5rem' }}>UK</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>Other items sold</td>
                <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>Rs. 1,166</td>
                <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>Rs. 816</td>
                <td style={{ padding: '0.875rem 0.5rem' }}>37</td>
                <td style={{ padding: '0.875rem 0.5rem' }}>33</td>
                <td style={{ padding: '0.875rem 0.5rem', color: '#00C875', fontWeight: 600 }}>✓ Active</td>
                <td style={{ padding: '0.875rem 0.5rem' }}>US</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E1B4B' }}>Returns by country</h4>
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 1rem' }}>
          How your returns and the commission deducted break down per country.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8438rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Country</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Returned</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Returns Value</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>US</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>4</td>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 800, color: '#EF4444' }}>Rs. 863</td>
              </tr>
              <tr style={{ fontWeight: 800 }}>
                <td style={{ padding: '0.75rem 0.5rem' }}>Total</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>4</td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#EF4444' }}>Rs. 863</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Earnings History Accordion Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B' }}>Earnings history</h3>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
              Day-by-day changes to your balance
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#1E1B4B',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <span>September 2026</span>
              <Calendar size={14} color="#6B7280" />
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#4B5563',
                cursor: 'pointer',
              }}
            >
              {showHistory ? 'Hide' : 'Show ▾'}
            </button>
          </div>
        </div>

        {showHistory && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>
              Tap a day to see where it came from
            </span>

            {historyDays.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: '#F9FAFB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                  <Play size={10} fill="#9CA3AF" color="#9CA3AF" />
                  <span>{item.day}</span>
                </div>
                <span style={{ color: item.isPositive ? '#00C875' : '#EF4444', fontWeight: 800 }}>
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. Walmart Earnings Section */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B', marginBottom: '1rem' }}>
          Walmart earnings
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Lifetime</span>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B', marginTop: '0.25rem' }}>Rs 0</div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Paid</span>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B', marginTop: '0.25rem' }}>Rs 0</div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Owed</span>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B', marginTop: '0.25rem' }}>Rs 0</div>
          </div>
        </div>

        <div style={{ padding: '0.875rem 1rem', borderRadius: '10px', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '0.875rem' }}>
          No Walmart earnings yet.
        </div>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: '2rem', padding: '1.5rem 0', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8125rem', borderTop: '1px solid #E5E7EB' }}>
        © 2026 LinkCraft. All rights reserved.
      </footer>
    </div>
  );
}
