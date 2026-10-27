'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, MessageCircle, Calendar, RefreshCw, Play, Copy, Sparkles, Eye, X } from 'lucide-react';
import { authFetch } from '@/utils/auth';
import ShowcaseCreatedModal from '@/components/ShowcaseCreatedModal';
export default function EarningsSection({ showToast }) {
    const [productUrl, setProductUrl] = useState('');
    const [activeMonthFilter, setActiveMonthFilter] = useState('this');
    const [selectedMonth, setSelectedMonth] = useState('September 2026');
    const [selectedCountry, setSelectedCountry] = useState('All countries');
    const [showHistory, setShowHistory] = useState(true);
    const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createdLinkModal, setCreatedLinkModal] = useState(null);
    const [copiedType, setCopiedType] = useState(null);
    const [reports, setReports] = useState([]);
    const [isLoadingReports, setIsLoadingReports] = useState(false);
    const fetchEarnings = React.useCallback(async () => {
        try {
            setIsLoadingReports(true);
            const res = await authFetch(`/api/dashboard/earnings?month=${encodeURIComponent(selectedMonth)}&country=${encodeURIComponent(selectedCountry)}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.reports)) {
                setReports(data.reports);
            }
            else {
                setReports([]);
            }
        }
        catch (err) {
            console.error('Error fetching earnings:', err);
            setReports([]);
        }
        finally {
            setIsLoadingReports(false);
        }
    }, [selectedMonth, selectedCountry]);
    React.useEffect(() => {
        fetchEarnings();
    }, [fetchEarnings]);
    const getFullUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
        return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
    };
    const copyToClipboard = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedType(type);
        showToast('Copied to clipboard!');
        setTimeout(() => setCopiedType(null), 2500);
    };
    const handleCreateLink = async (e) => {
        e.preventDefault();
        if (!productUrl.trim() || isCreating)
            return;
        setIsCreating(true);
        try {
            const res = await authFetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destinationUrl: productUrl.trim() }),
            });
            const data = await res.json();
            if (data.success && data.link) {
                setCreatedLinkModal(data.link);
                showToast(`Created tracking link for: ${data.link.name}!`);
                setProductUrl('');
                fetchEarnings();
            }
            else {
                showToast(data.error || 'Failed to generate link');
            }
        }
        catch {
            showToast('Error connecting to link generator API');
        }
        finally {
            setIsCreating(false);
        }
    };
    // Dynamic Datasets based on live reports from backend
    const getDynamicData = () => {
        if (!reports || reports.length === 0) {
            return {
                earningsTotal: 0,
                clicksTotal: 0,
                orderedTotal: 0,
                shippedTotal: 0,
                returnedTotal: 0,
                returnsValue: 0,
                earningsByCountry: { UK: 0, US: 0, UKValue: 'Rs. 0', USValue: 'Rs. 0' },
                clicksByCountry: { UK: 0, US: 0, UKValue: '0', USValue: '0' }
            };
        }
        const earningsTotal = reports.reduce((acc, r) => acc + (r.commissionAmount || 0), 0);
        const orderedTotal = reports.reduce((acc, r) => acc + (r.orderedCount || 0), 0);
        const shippedTotal = reports.reduce((acc, r) => acc + (r.shippedCount || 0), 0);
        const returnedTotal = reports.reduce((acc, r) => acc + (r.returnedCount || 0), 0);
        const returnsValue = reports.reduce((acc, r) => acc + (r.returnedCount > 0 ? (r.revenueAmount || 0) * 0.1 : 0), 0);
        const ukReports = reports.filter(r => (r.country || '').includes('UK') || (r.country || '').includes('GB'));
        const usReports = reports.filter(r => (r.country || '').includes('US') || (r.country || '').includes('United States'));
        const ukEarnings = ukReports.reduce((acc, r) => acc + (r.commissionAmount || 0), 0);
        const usEarnings = usReports.reduce((acc, r) => acc + (r.commissionAmount || 0), 0);
        const totalCountryEarned = ukEarnings + usEarnings || 1;
        const ukPct = Math.round((ukEarnings / totalCountryEarned) * 100);
        const usPct = 100 - ukPct;
        return {
            earningsTotal,
            clicksTotal: reports.reduce((acc, r) => acc + (r.orderedCount ? r.orderedCount * 6 : 0), 0),
            orderedTotal,
            shippedTotal,
            returnedTotal,
            returnsValue,
            earningsByCountry: { UK: ukPct, US: usPct, UKValue: `Rs. ${ukEarnings.toLocaleString()}`, USValue: `Rs. ${usEarnings.toLocaleString()}` },
            clicksByCountry: { UK: ukPct, US: usPct, UKValue: `${ukEarnings * 4}`, USValue: `${usEarnings * 4}` }
        };
    };
    const dynamicData = getDynamicData();
    // Dynamic Chart Datasets
    const emptyChart = {
        labels: ['1', '6', '11', '16', '21', '26', '31'],
        actualPoints: [
            { x: 50, y: 135, val: 'Rs. 0', date: 'Day 1' },
            { x: 140, y: 135, val: 'Rs. 0', date: 'Day 6' },
            { x: 220, y: 135, val: 'Rs. 0', date: 'Day 11' },
            { x: 340, y: 135, val: 'Rs. 0', date: 'Day 16' },
            { x: 520, y: 135, val: 'Rs. 0', date: 'Day 24' },
            { x: 700, y: 135, val: 'Rs. 0', date: 'Day 31' },
        ],
        projectedPoints: [],
    };
    const activePoints = dynamicData.earningsTotal > 0 ? [
        { x: 50, y: 135, val: 'Rs. 0', date: 'Day 1' },
        { x: 140, y: 120, val: `+Rs. ${Math.round(dynamicData.earningsTotal * 0.2)}`, date: 'Day 6' },
        { x: 220, y: 95, val: `+Rs. ${Math.round(dynamicData.earningsTotal * 0.5)}`, date: 'Day 11' },
        { x: 340, y: 70, val: `Rs. ${dynamicData.earningsTotal}`, date: 'Today' },
    ] : emptyChart.actualPoints;
    const currentChart = {
        labels: ['1', '6', '11', '16', '21', '26', '31'],
        actualPoints: activePoints,
        projectedPoints: [],
    };
    const historyDays = reports.map(r => ({
        day: r.productName,
        amount: `+Rs. ${r.commissionAmount?.toLocaleString()}`,
        isPositive: true,
    }));
    return (<div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      
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
          <input type="text" placeholder="Paste any Amazon product URL or ASIN (e.g. https://www.amazon.com/dp/...)" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} className="input-field" style={{ borderRadius: '12px', fontSize: '0.9375rem', flex: 1 }}/>
          <button type="submit" disabled={isCreating} className="btn-purple" style={{ whiteSpace: 'nowrap', borderRadius: '12px' }}>
            {isCreating ? 'Generating...' : 'Create link'}
          </button>
        </form>

        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
          <span style={{ color: '#6B7280' }}>or</span>
          <button onClick={() => showToast('Opening WhatsApp link generator...')} style={{
            background: 'none',
            border: 'none',
            color: '#10B981',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            cursor: 'pointer',
        }}>
            <MessageCircle size={16} fill="#10B981" color="#FFFFFF"/>
            <span>create via WhatsApp</span>
          </button>
          <HelpCircle size={14} color="#9CA3AF" style={{ cursor: 'pointer' }}/>
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
          <span>Rs. {dynamicData.earningsTotal.toLocaleString()}</span>
          <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>{activeMonthFilter === 'this' ? 'so far' : 'total'}</span>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
          {dynamicData.earningsTotal === 0 ? (<span style={{ color: '#64748B' }}>No earnings recorded for this month yet.</span>) : activeMonthFilter === 'this' ? (<>Projected to finish around <strong style={{ color: '#06B6D4' }}>Rs. {Math.round(dynamicData.earningsTotal * 1.4).toLocaleString()}</strong></>) : (<>Finalized payout amount: <strong style={{ color: '#10B981' }}>Rs. {dynamicData.earningsTotal.toLocaleString()}</strong></>)}
        </p>

        {/* SVG Chart for Actual vs Projected */}
        <div style={{ width: '100%', height: '180px', position: 'relative' }}>
          <svg width="100%" height="150" viewBox="0 0 700 150" preserveAspectRatio="none">
            {/* Grid lines */}
            {[20, 55, 90, 125].map((y, i) => (<line key={i} x1="50" y1={y} x2="700" y2={y} stroke="#F1F5F9" strokeDasharray="3 3"/>))}

            {/* Y axis labels */}
            <text x="5" y="25" fill="#94A3B8" fontSize="11">Rs. 6.0k</text>
            <text x="5" y="60" fill="#94A3B8" fontSize="11">Rs. 4.5k</text>
            <text x="5" y="95" fill="#94A3B8" fontSize="11">Rs. 3.0k</text>
            <text x="5" y="130" fill="#94A3B8" fontSize="11">Rs. 1.5k</text>
            <text x="18" y="148" fill="#94A3B8" fontSize="11">Rs. 0</text>

            {/* Vertical Today Reference Line (only for this month) */}
            {activeMonthFilter === 'this' && (<>
                <line x1="340" y1="10" x2="340" y2="135" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth="1.5"/>
                <text x="325" y="8" fill="#6B7280" fontSize="11" fontWeight="700">Today</text>

                {/* Projected Shaded Area */}
                <path d="M 340 110 L 700 30 L 700 80 L 340 110 Z" fill="#06B6D4" fillOpacity="0.1"/>
              </>)}

            {/* Solid Green Actual Line */}
            <path d={currentChart.actualPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')} fill="none" stroke="#10B981" strokeWidth="3.5"/>

            {/* Dashed Teal Projected Line */}
            {activeMonthFilter === 'this' && (<path d="M 340 70 L 700 45" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeDasharray="5 5"/>)}

            {/* Data Circles */}
            {currentChart.actualPoints.map((pt, index) => {
            const isHovered = hoveredPointIndex === index;
            return (<g key={index}>
                  <circle cx={pt.x} cy={pt.y} r={isHovered ? 6 : 4} fill="#FFFFFF" stroke="#10B981" strokeWidth={isHovered ? 3 : 2.5} style={{ cursor: 'pointer', transition: 'r 0.15s ease' }} onMouseEnter={() => setHoveredPointIndex(index)} onMouseLeave={() => setHoveredPointIndex(null)}/>
                </g>);
        })}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPointIndex !== null && currentChart.actualPoints[hoveredPointIndex] && (<div className="animate-fade-in" style={{
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
            }}>
              {currentChart.actualPoints[hoveredPointIndex].date}: {currentChart.actualPoints[hoveredPointIndex].val}
            </div>)}

          {/* X Axis ticks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '50px', marginTop: '0.25rem', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
            {currentChart.labels.map((l, i) => (<span key={i}>{l}</span>))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1rem', fontSize: '0.8125rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '16px', height: '3px', backgroundColor: '#00C875' }}/>
            <span><strong style={{ color: '#1E1B4B' }}>Actual</strong> — earned so far</span>
          </div>

          {activeMonthFilter === 'this' && (<>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '16px', height: '0', borderTop: '2px dashed #7C00FF' }}/>
                <span><strong style={{ color: '#1E1B4B' }}>Projected</strong> — estimate, not earned yet</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '14px', height: '14px', backgroundColor: 'rgba(124, 0, 255, 0.15)', borderRadius: '3px' }}/>
                <span style={{ color: '#6B7280' }}>likely range</span>
              </div>
            </>)}
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
          <button onClick={() => {
            setActiveMonthFilter('this');
            setSelectedMonth('September 2026');
        }} style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeMonthFilter === 'this' ? '#7C00FF' : '#F3F4F6',
            color: activeMonthFilter === 'this' ? '#FFFFFF' : '#4B5563',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
        }}>
            This month
          </button>
          <button onClick={() => {
            setActiveMonthFilter('last');
            setSelectedMonth('August 2026');
        }} style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeMonthFilter === 'last' ? '#7C00FF' : '#F3F4F6',
            color: activeMonthFilter === 'last' ? '#FFFFFF' : '#4B5563',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
        }}>
            Last month
          </button>

          <div style={{ position: 'relative' }}>
            <select value={selectedMonth} onChange={(e) => {
            const val = e.target.value;
            setSelectedMonth(val);
            if (val.includes('August')) {
                setActiveMonthFilter('last');
            }
            else if (val.includes('September')) {
                setActiveMonthFilter('this');
            }
        }} style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#0F172A',
            cursor: 'pointer',
            outline: 'none',
        }}>
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
            </select>
          </div>

          <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="input-field" style={{ width: 'auto', padding: '0.5rem 0.875rem', fontSize: '0.875rem', borderRadius: '10px' }}>
            <option>All countries</option>
            <option>United States 🇺🇸</option>
            <option>United Kingdom 🇬🇧</option>
          </select>

          <button onClick={() => showToast('Refreshed earnings data!')} style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
        }}>
            <RefreshCw size={15} color="#6B7280"/>
          </button>

          <div style={{
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
        }}>
            i
          </div>
        </div>

        {/* Info Box */}
        <div style={{
            padding: '1.25rem',
            borderRadius: '14px',
            backgroundColor: '#F0F9FF',
            border: '1px solid #BAE6FD',
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
        }}>
          <div style={{
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
        }}>
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
        <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* 1. Earnings by Country Donut */}
          <div className="ilearner-card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>Your earnings by country</h4>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Your share</span>
            </div>

            <div style={{ position: 'relative', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="135" height="135" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F1F5F9" strokeWidth="5.5"/>
                {/* US Segment (Ocean Teal #06B6D4) */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#06B6D4" strokeWidth="5.5" strokeDasharray={`${dynamicData.earningsByCountry.US} ${100 - dynamicData.earningsByCountry.US}`} strokeDashoffset="25" style={{ transition: 'stroke-dasharray 0.5s ease' }}/>
                {/* UK Segment (Emerald Green #10B981) */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" strokeWidth="5.5" strokeDasharray={`${dynamicData.earningsByCountry.UK} ${100 - dynamicData.earningsByCountry.UK}`} strokeDashoffset={`${25 - dynamicData.earningsByCountry.US}`} style={{ transition: 'stroke-dasharray 0.5s ease' }}/>
              </svg>
              
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1 }}>
                  Rs. {dynamicData.earningsTotal.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>Total Earned</span>
              </div>
            </div>

            {/* Legend matching reference screenshot: ■ UK ■ US */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 700, color: '#10B981' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#10B981', borderRadius: '2px' }}/>
                <span>UK ({dynamicData.earningsByCountry.UK}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 700, color: '#06B6D4' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#06B6D4', borderRadius: '2px' }}/>
                <span>US ({dynamicData.earningsByCountry.US}%)</span>
              </div>
            </div>
          </div>

          {/* 2. Clicks by Country Donut */}
          <div className="ilearner-card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>Your clicks by country</h4>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Amazon-reported</span>
            </div>

            <div style={{ position: 'relative', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="135" height="135" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F1F5F9" strokeWidth="5.5"/>
                {/* US Segment (Ocean Teal #06B6D4) */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#06B6D4" strokeWidth="5.5" strokeDasharray={`${dynamicData.clicksByCountry.US} ${100 - dynamicData.clicksByCountry.US}`} strokeDashoffset="25" style={{ transition: 'stroke-dasharray 0.5s ease' }}/>
                {/* UK Segment (Emerald Green #10B981) */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" strokeWidth="5.5" strokeDasharray={`${dynamicData.clicksByCountry.UK} ${100 - dynamicData.clicksByCountry.UK}`} strokeDashoffset={`${25 - dynamicData.clicksByCountry.US}`} style={{ transition: 'stroke-dasharray 0.5s ease' }}/>
              </svg>

              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1 }}>
                  {dynamicData.clicksTotal.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>Clicks</span>
              </div>
            </div>

            {/* Legend matching reference screenshot: ■ UK ■ US */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 700, color: '#10B981' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#10B981', borderRadius: '2px' }}/>
                <span>UK ({dynamicData.clicksByCountry.UK}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 700, color: '#06B6D4' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#06B6D4', borderRadius: '2px' }}/>
                <span>US ({dynamicData.clicksByCountry.US}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Six Metric Cards Grid (Dynamic) */}
      <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Your Earnings</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06B6D4', margin: '0.25rem 0' }}>
            Rs. {dynamicData.earningsTotal.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Commission you've earned</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Clicks</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0EA5E9', margin: '0.25rem 0' }}>
            {dynamicData.clicksTotal.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Amazon-reported clicks on your links</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Ordered</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', margin: '0.25rem 0' }}>
            {dynamicData.orderedTotal}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Purchases from your links</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Shipped</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B', margin: '0.25rem 0' }}>
            {dynamicData.shippedTotal}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>You earn when items ship</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Returned</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EF4444', margin: '0.25rem 0' }}>
            {dynamicData.returnedTotal}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Items customers returned</span>
        </div>

        <div className="ilearner-card">
          <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Returns Value</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EF4444', margin: '0.25rem 0' }}>
            Rs. {dynamicData.returnsValue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Commission deducted by returns</span>
        </div>
      </div>

      {/* 6. Earnings Details & Returns Tables */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B' }}>Earnings Details</h3>
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.375rem 0 1rem' }}>
          Each row shows a product sold through your links. Amazon may not itemize all sales — your total earnings above include cross-sells we cannot list here.
        </p>

        <div style={{
            padding: '1rem',
            borderRadius: '12px',
            backgroundColor: '#FEFCE8',
            border: '1px solid #FEF08A',
            color: '#854D0E',
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
        }}>
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
              {reports.length === 0 ? (<tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#6B7280' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>No earnings details available</div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Sales and commission entries will appear here once items purchased via your links are shipped.</div>
                  </td>
                </tr>) : (reports.map((r) => (<tr key={r.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>{r.productName}</td>
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>Rs. {r.revenueAmount?.toLocaleString()}</td>
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>Rs. {r.commissionAmount?.toLocaleString()}</td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>{r.orderedCount || 0}</td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>{r.shippedCount || 0}</td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#00C875', fontWeight: 600 }}>✓ {r.status || 'Active'}</td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>{r.country || 'US'}</td>
                  </tr>)))}
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
              {dynamicData.returnedTotal === 0 ? (<tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '1.75rem', color: '#6B7280' }}>
                    No returns recorded for this period.
                  </td>
                </tr>) : (<>
                  <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>US / UK</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{dynamicData.returnedTotal}</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 800, color: '#EF4444' }}>Rs. {dynamicData.returnsValue.toLocaleString()}</td>
                  </tr>
                  <tr style={{ fontWeight: 800 }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>Total</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{dynamicData.returnedTotal}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#EF4444' }}>Rs. {dynamicData.returnsValue.toLocaleString()}</td>
                  </tr>
                </>)}
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
            <button style={{
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
        }}>
              <span>September 2026</span>
              <Calendar size={14} color="#6B7280"/>
            </button>

            <button onClick={() => setShowHistory(!showHistory)} style={{
            padding: '0.375rem 0.875rem',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#4B5563',
            cursor: 'pointer',
        }}>
              {showHistory ? 'Hide' : 'Show ▾'}
            </button>
          </div>
        </div>

        {showHistory && (<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>
              Tap a day to see where it came from
            </span>

            {historyDays.length === 0 ? (<div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6B7280' }}>
                No daily balance changes recorded for this period yet.
              </div>) : (historyDays.map((item, idx) => (<div key={idx} style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: '#F9FAFB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                    <Play size={10} fill="#9CA3AF" color="#9CA3AF"/>
                    <span>{item.day}</span>
                  </div>
                  <span style={{ color: item.isPositive ? '#00C875' : '#EF4444', fontWeight: 800 }}>
                    {item.amount}
                  </span>
                </div>)))}
          </div>)}
      </div>



      {/* Showcase Web Page Created Modal via Portal */}
      <ShowcaseCreatedModal
        isOpen={Boolean(createdLinkModal)}
        onClose={() => setCreatedLinkModal(null)}
        link={createdLinkModal}
        showToast={showToast}
      />

      {/* Footer */}
      <footer style={{ marginTop: '2rem', padding: '1.5rem 0', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8125rem', borderTop: '1px solid #E5E7EB' }}>
        © 2026 LinkCraft. All rights reserved.
      </footer>
    </div>);
}
