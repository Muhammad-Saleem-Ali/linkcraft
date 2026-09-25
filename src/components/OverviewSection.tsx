'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  X,
  Gift,
  Search,
  Calendar,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface OverviewSectionProps {
  showToast: (msg: string) => void;
}

export default function OverviewSection({ showToast }: OverviewSectionProps) {
  const [productUrl, setProductUrl] = useState('');
  const [activeChartTab, setActiveChartTab] = useState('7-Day Trends');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGiftWidget, setShowGiftWidget] = useState(true);

  // Dynamic Datasets for the Chart Tabs
  const chartDatasets: Record<string, {
    labels: string[];
    maxY: number;
    yTicks: number[];
    series1: { name: string; color: string; values: number[] };
    series2?: { name: string; color: string; values: number[] };
  }> = {
    '7-Day Trends': {
      labels: ['2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-12', '2026-09-13', '2026-09-14'],
      maxY: 24,
      yTicks: [24, 18, 12, 6, 0],
      series1: { name: 'Views', color: '#0EA5E9', values: [16, 14, 16, 11, 20, 2, 8] },
      series2: { name: 'Clicks', color: '#06B6D4', values: [1, 2, 4, 3, 0, 2, 3] },
    },
    'Monthly': {
      labels: ['Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'],
      maxY: 500,
      yTicks: [500, 375, 250, 125, 0],
      series1: { name: 'Monthly Views', color: '#0EA5E9', values: [120, 180, 340, 410, 480, 258] },
      series2: { name: 'Monthly Clicks', color: '#10B981', values: [15, 22, 48, 65, 82, 35] },
    },
    'Revenue': {
      labels: ['Sep 01', 'Sep 03', 'Sep 05', 'Sep 07', 'Sep 09', 'Sep 11', 'Sep 13'],
      maxY: 8000,
      yTicks: [8000, 6000, 4000, 2000, 0],
      series1: { name: 'Revenue (Rs.)', color: '#10B981', values: [7860, 0, 50, 511, 0, 311, 41] },
      series2: { name: 'Commission (Rs.)', color: '#06B6D4', values: [5502, 0, 35, 357, 0, 217, 28] },
    },
    'Top Products': {
      labels: ['Calm Magnesium', 'Prime Modal', 'Vaginal Moist.', 'Silk Peptide', 'Kennel Cough', 'TPU PPF', 'Rain Guards'],
      maxY: 50,
      yTicks: [50, 37, 25, 12, 0],
      series1: { name: 'Product Clicks', color: '#06B6D4', values: [42, 35, 28, 22, 18, 12, 8] },
    },
  };

  const currentData = chartDatasets[activeChartTab] || chartDatasets['7-Day Trends'];

  // Calculate SVG curve paths dynamically
  const svgWidth = 700;
  const svgHeight = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const usableWidth = svgWidth - paddingLeft - paddingRight;
  const usableHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    const total = currentData.labels.length;
    if (total <= 1) return paddingLeft;
    return paddingLeft + (index / (total - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const ratio = val / currentData.maxY;
    return paddingTop + (1 - ratio) * usableHeight;
  };

  // Generate smooth SVG Path string for series
  const generatePath = (values: number[]) => {
    if (!values || values.length === 0) return '';
    const points = values.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX = (curr.x + next.x) / 2;
      path += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  // Best Performers Static Data
  const bestPerformers = [
    { title: 'Calm Magnesium Glycinate Powder Drink Mi...', clicks: 0, conv: '0.0%' },
    { title: 'open prime modalclose prime modalClose b...', clicks: 0, conv: '0.0%' },
    { title: 'Vaginal Moisturizer, Hyaluronic Acid', clicks: 0, conv: '0.0%' },
    { title: 'SILK PEPTIDE INTENSIVE AMPOULE, PDRN Pink...', clicks: 0, conv: '0.0%' },
    { title: 'Kennel Cough Medicine for Dogs,Fast Reli...', clicks: 0, conv: '0.0%' },
    { title: 'TPU PPF, Clear High Gloss Paint Protecti...', clicks: 0, conv: '0.0%' },
    { title: 'Rain Guards Window Visors 6PCS Chrome fo...', clicks: 0, conv: '0.0%' },
  ];

  // Recent Links Static Data
  const recentLinks = [
    { id: 'rl-1', title: 'Funny Boss Day Card - Hav...', views: 1, clicks: 0, country: '🇺🇸' },
    { id: 'rl-2', title: 'Funny Boss Day Card for M...', views: 1, clicks: 0, country: '🇺🇸' },
    { id: 'rl-3', title: 'Happy Boss Day Card for M...', views: 0, clicks: 0, country: '🇺🇸' },
    { id: 'rl-4', title: 'Calm Magnesium Glycinate ...', views: 0, clicks: 0, country: '🇺🇸' },
  ];

  // Your Links Table Static Data
  const yourLinks = [
    { id: 'yl-1', title: 'Funny Boss Day Card - Having l...', created: '9/14/2026', views: 1, clicks: 0, country: '🇺🇸' },
    { id: 'yl-2', title: 'Funny Boss Day Card for Men v...', created: '9/14/2026', views: 1, clicks: 0, country: '🇺🇸' },
    { id: 'yl-3', title: 'Happy Boss Day Card for Men v...', created: '9/14/2026', views: 0, clicks: 0, country: '🇺🇸' },
    { id: 'yl-4', title: 'Calm Magnesium Glycinate Po...', created: '9/13/2026', views: 0, clicks: 0, country: '🇺🇸' },
    { id: 'yl-5', title: 'open prime modalclose prime ...', created: '9/13/2026', views: 0, clicks: 0, country: '🇺🇸' },
    { id: 'yl-6', title: 'Vaginal Moisturizer, Hyaluronic...', created: '9/12/2026', views: 0, clicks: 0, country: '🇺🇸' },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(`https://ilearner.dev/r/${id}`);
    setCopiedId(id);
    showToast(`Copied tracking link to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return;
    showToast(`Created tracking link for URL!`);
    setProductUrl('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      
      {/* 1. Breadcrumb */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
        <span style={{ color: '#9CA3AF' }}>Home</span>
        <span>›</span>
        <span style={{ color: '#1E1B4B', fontWeight: 700 }}>Dashboard</span>
      </div>

      {/* 2. Create Link Card */}
      <div className="ilearner-card" style={{ padding: '1.25rem 1.5rem' }}>
        <form onSubmit={handleCreateLink} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Paste an Amazon or Walmart product URL"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            className="input-field"
            style={{ borderRadius: '12px', fontSize: '0.9375rem' }}
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

      {/* 3. CURRENTLY OWED Banner */}
      <div className="ilearner-card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--brand-shadow-md)' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #06B6D4 100%)',
            color: '#FFFFFF',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', opacity: 0.9 }}>
              CURRENTLY OWED
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0.25rem 0' }}>
              Rs. 3,530
            </div>
            <span style={{ fontSize: '0.8438rem', opacity: 0.85 }}>What we still owe you</span>
          </div>

          <a href="#" style={{ fontSize: '0.8438rem', fontWeight: 600, color: '#FFFFFF', textDecoration: 'underline' }}>
            Earnings history ›
          </a>
        </div>

        <div style={{ backgroundColor: '#FFFFFF' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B' }}>September 2026</div>
              <span style={{ fontSize: '0.8125rem', color: '#D97706', fontWeight: 600 }}>⏳ Pending</span>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B' }}>Rs. 1,958</div>
          </div>

          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B' }}>August 2026</div>
              <span style={{ fontSize: '0.8125rem', color: '#D97706', fontWeight: 600 }}>⏳ Pending</span>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Rs. 1,572</span>
              <ChevronRight size={18} color="#9CA3AF" />
            </div>
          </div>

          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B' }}>June 2026</div>
              <span style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>✓ Paid — Rs. 6,188</span>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Rs. 6,188</span>
              <ChevronRight size={18} color="#9CA3AF" />
            </div>
          </div>

          <div style={{ padding: '1.125rem 1.5rem', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block', fontWeight: 500 }}>Lifetime</span>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>Rs. 17,579</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block', fontWeight: 500 }}>Paid</span>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>Rs. 14,049</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Four Big Metrics Card Grid */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06B6D4' }}>258</div>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Views</span>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>1</div>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Clicks</span>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0EA5E9' }}>1,136</div>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Links</span>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B' }}>0.4%</div>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Conversion</span>
          </div>
        </div>
      </div>

      {/* 5. FULLY DYNAMIC & INTERACTIVE GRAPH CARD */}
      <div className="ilearner-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
          {['7-Day Trends', 'Monthly', 'Revenue', 'Top Products'].map((tab) => {
            const isActive = activeChartTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveChartTab(tab);
                  setHoveredPointIndex(null);
                }}
                style={{
                  padding: '1rem 1.5rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.875rem',
                  color: isActive ? '#1E1B4B' : '#6B7280',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 0.2s',
                }}
              >
                {tab}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#06B6D4',
                      borderRadius: '3px 3px 0 0',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Chart Container */}
        <div style={{ padding: '1.5rem', width: '100%', position: 'relative' }}>
          
          {/* Series Legend Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: currentData.series1.color }} />
              <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{currentData.series1.name}</span>
            </div>
            {currentData.series2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: currentData.series2.color }} />
                <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{currentData.series2.name}</span>
              </div>
            )}
          </div>

          {/* Interactive SVG Render Area */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg width="100%" height="180" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
              
              {/* Dashed Horizontal Y Gridlines */}
              {currentData.yTicks.slice(0, 4).map((tick, i) => {
                const y = getY(tick);
                return (
                  <g key={i}>
                    <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
                    <text x="5" y={y + 4} fill="#94A3B8" fontSize="11" fontWeight="600">{tick}</text>
                  </g>
                );
              })}

              {/* Dynamic Line Paths */}
              <path
                d={generatePath(currentData.series1.values)}
                fill="none"
                stroke={currentData.series1.color}
                strokeWidth="3"
                style={{ transition: 'd 0.3s ease' }}
              />

              {currentData.series2 && (
                <path
                  d={generatePath(currentData.series2.values)}
                  fill="none"
                  stroke={currentData.series2.color}
                  strokeWidth="3"
                  style={{ transition: 'd 0.3s ease' }}
                />
              )}

              {/* Dynamic Data Circles & Interactive Hover Hits */}
              {currentData.labels.map((_, index) => {
                const x = getX(index);
                const y1 = getY(currentData.series1.values[index]);
                const isHovered = hoveredPointIndex === index;

                return (
                  <g key={index}>
                    {/* Hover vertical line */}
                    {isHovered && (
                      <line x1={x} y1={paddingTop} x2={x} y2={svgHeight - paddingBottom} stroke="#7C00FF" strokeDasharray="3 3" strokeWidth="1.5" />
                    )}

                    {/* Circle Point Series 1 */}
                    <circle
                      cx={x}
                      cy={y1}
                      r={isHovered ? 6 : 4}
                      fill="#FFFFFF"
                      stroke={currentData.series1.color}
                      strokeWidth={isHovered ? 3 : 2.5}
                      style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                    />

                    {/* Circle Point Series 2 */}
                    {currentData.series2 && (
                      <circle
                        cx={x}
                        cy={getY(currentData.series2.values[index])}
                        r={isHovered ? 6 : 4}
                        fill="#FFFFFF"
                        stroke={currentData.series2.color}
                        strokeWidth={isHovered ? 3 : 2.5}
                        style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                      />
                    )}

                    {/* Invisible Hitbox area for hover */}
                    <rect
                      x={x - 20}
                      y={0}
                      width={40}
                      height={svgHeight}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPointIndex(index)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Floating Tooltip Popup on Hover */}
            {hoveredPointIndex !== null && (
              <div
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: `${(hoveredPointIndex / (currentData.labels.length - 1)) * 80 + 10}%`,
                  transform: 'translateX(-50%)',
                  backgroundColor: '#12092C',
                  color: '#FFFFFF',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '10px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  zIndex: 20,
                  pointerEvents: 'none',
                  fontSize: '0.8125rem',
                  lineHeight: 1.4,
                }}
              >
                <div style={{ fontWeight: 800, color: '#A5B4FC', marginBottom: '0.25rem' }}>
                  {currentData.labels[hoveredPointIndex]}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <span>{currentData.series1.name}:</span>
                  <span style={{ fontWeight: 800 }}>{currentData.series1.values[hoveredPointIndex]}</span>
                </div>
                {currentData.series2 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span>{currentData.series2.name}:</span>
                    <span style={{ fontWeight: 800 }}>{currentData.series2.values[hoveredPointIndex]}</span>
                  </div>
                )}
              </div>
            )}

            {/* Dynamic X-Axis Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '35px', paddingRight: '15px', marginTop: '0.5rem', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
              {currentData.labels.map((lbl, idx) => (
                <span
                  key={idx}
                  style={{
                    color: hoveredPointIndex === idx ? '#7C00FF' : '#94A3B8',
                    fontWeight: hoveredPointIndex === idx ? 800 : 600,
                  }}
                >
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Best Performers Card */}
      <div className="ilearner-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E1B4B' }}>Best Performers</h3>
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', cursor: 'pointer' }}>by clicks ▾</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {bestPerformers.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', color: '#6B7280', flex: 1, overflow: 'hidden' }}>
                <span style={{ width: '16px', color: '#9CA3AF' }}>{index + 1}</span>
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#374151' }}>
                  {item.title}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600 }}>
                <span style={{ color: '#00C875' }}>{item.clicks} clicks</span>
                <span style={{ color: '#9CA3AF' }}>{item.conv} conv</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 & 8. Today & Last 7 Days Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <div style={{ backgroundColor: '#00C875', color: '#FFFFFF', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 4px 12px rgba(0, 200, 117, 0.2)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Today</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Views</span>
              <span style={{ fontWeight: 800 }}>9</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Clicks</span>
              <span style={{ fontWeight: 800 }}>0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>New Links</span>
              <span style={{ fontWeight: 800 }}>0</span>
            </div>
          </div>
        </div>

        <div className="ilearner-card" style={{ padding: '1.25rem 1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#1E1B4B' }}>Last 7 Days</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Views</span>
              <span style={{ fontWeight: 800, color: '#7C00FF' }}>22</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Clicks</span>
              <span style={{ fontWeight: 800, color: '#00C875' }}>0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 9. How It Works */}
      <div className="ilearner-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1rem' }}>
            <span>💡</span>
            <span>How it works</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', cursor: 'pointer' }}>click to expand</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#3B82F6', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Create affiliate links</div>
              <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Paste any Amazon URL here or via WhatsApp</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#3B82F6', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Share with friends</div>
              <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>When they buy, you earn commission</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Get paid</div>
              <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>We pay you directly to your bank</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => showToast('Opening WhatsApp link generator...')}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '12px',
            border: '1px solid #A7F3D0',
            backgroundColor: '#ECFDF5',
            color: '#047857',
            fontWeight: 700,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <MessageCircle size={18} fill="#047857" color="#ECFDF5" />
          <span>Link WhatsApp for quick links</span>
        </button>
      </div>

      {/* 10. How We Calculate Earnings Banner */}
      <div
        style={{
          backgroundColor: '#7C00FF',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--brand-shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={20} color="#FFFFFF" />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>How we calculate earnings</h4>
            <span style={{ fontSize: '0.8125rem', opacity: 0.85 }}>See our transparency process</span>
          </div>
        </div>

        <ChevronRight size={22} color="#FFFFFF" />
      </div>

      {/* 11. Recent Links Card */}
      <div className="ilearner-card" style={{ padding: '1.25rem 1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E1B4B' }}>Recent Links</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentLinks.map((link) => (
            <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E1B4B', marginBottom: '0.125rem' }}>
                  {link.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  {link.country} {link.views} views • {link.clicks} clicks
                </div>
              </div>

              <button
                onClick={() => handleCopy(link.id, link.title)}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                }}
              >
                {copiedId === link.id ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                <span>{copiedId === link.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 12. Your Links Filtered Table Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem 1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', color: '#1E1B4B' }}>Your Links</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select className="input-field" style={{ width: 'auto', minWidth: '130px', padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}>
              <option>All countries</option>
              <option>United States 🇺🇸</option>
              <option>Pakistan 🇵🇰</option>
            </select>

            <input
              type="text"
              placeholder="Search title/description"
              className="input-field"
              style={{ flex: 1, minWidth: '180px', padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
            />

            <input
              type="text"
              placeholder="Tag"
              className="input-field"
              style={{ width: '100px', padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
              Last 7 days
            </button>
            <button style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
              Last 30 days
            </button>
            <button style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
              This month
            </button>

            <input type="text" placeholder="mm / dd / yyyy 📅" className="input-field" style={{ width: '140px', padding: '0.375rem 0.5rem', fontSize: '0.75rem' }} />
            <input type="text" placeholder="mm / dd / yyyy 📅" className="input-field" style={{ width: '140px', padding: '0.375rem 0.5rem', fontSize: '0.75rem' }} />

            <button style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
              Clear all
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>PRODUCT</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>CREATED</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>VIEWS</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>CLICKS</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {yourLinks.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#1E1B4B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span>{row.country}</span>
                      <span>{row.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6B7280' }}>
                    {row.created}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>
                    {row.views}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>
                    {row.clicks}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                      <button
                        onClick={() => showToast(`Viewing analytics for ${row.title}`)}
                        style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          cursor: 'pointer',
                        }}
                      >
                        <ExternalLink size={12} />
                        View
                      </button>

                      <button
                        onClick={() => showToast(`Revoked link: ${row.title}`)}
                        style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: '6px',
                          border: '1px solid #FCA5A5',
                          backgroundColor: '#FEF2F2',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#DC2626',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✖ Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 13. Floating Gift Widget */}
      {showGiftWidget && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          <button
            onClick={() => setShowGiftWidget(false)}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--brand-shadow-sm)',
            }}
          >
            <X size={12} color="#6B7280" />
          </button>

          <div
            onClick={() => showToast('Claim partner bonus reward!')}
            style={{
              position: 'relative',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C00FF 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(124, 0, 255, 0.4)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '1.75rem' }}>🎁</span>
            <span
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#12092C',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              2
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
