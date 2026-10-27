'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, HelpCircle, MessageCircle, Copy, Check, ExternalLink, X, TrendingUp, BarChart3, Sparkles, Eye, Trash2 } from 'lucide-react';
import { authFetch } from '@/utils/auth';
import ShowcaseCreatedModal from '@/components/ShowcaseCreatedModal';
export default function OverviewSection({ showToast }) {
    const [productUrl, setProductUrl] = useState('');
    const [activeChartTab, setActiveChartTab] = useState('7-Day Trends');
    const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [copiedType, setCopiedType] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [showGiftWidget, setShowGiftWidget] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    // Table search & filter state
    const [tableSearch, setTableSearch] = useState('');
    const [tableCountry, setTableCountry] = useState('All countries');
    // Live state from backend
    const [stats, setStats] = useState(null);
    const [linksList, setLinksList] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [latestCreatedLink, setLatestCreatedLink] = useState(null);
    const [createdLinkModal, setCreatedLinkModal] = useState(null);
    const loadData = React.useCallback(async () => {
        try {
            const [statsRes, linksRes] = await Promise.all([
                authFetch('/api/dashboard/stats'),
                authFetch('/api/links'),
            ]);
            const statsData = await statsRes.json();
            const linksData = await linksRes.json();
            if (statsData.success && statsData.stats) {
                setStats(statsData.stats);
            }
            if (linksData.success && Array.isArray(linksData.links)) {
                setLinksList(linksData.links);
            }
        }
        catch (err) {
            console.error('Failed to load overview data:', err);
        }
    }, []);
    const loadChartData = React.useCallback(async (rangeTab) => {
        try {
            const res = await authFetch(`/api/dashboard/chart?range=${encodeURIComponent(rangeTab)}`);
            const data = await res.json();
            if (data.success && data.data) {
                setChartData(data.data);
            }
        }
        catch (err) {
            console.error('Failed to load chart data:', err);
        }
    }, []);
    React.useEffect(() => {
        loadData();
    }, [loadData]);
    React.useEffect(() => {
        loadChartData(activeChartTab);
    }, [activeChartTab, loadChartData]);
    // Fallback structure when chart data is empty or initial
    const defaultChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        maxY: 10,
        yTicks: [10, 8, 6, 4, 2, 0],
        series1: { name: 'Views', color: '#0EA5E9', values: [0, 0, 0, 0, 0, 0, 0] },
        series2: { name: 'Clicks', color: '#06B6D4', values: [0, 0, 0, 0, 0, 0, 0] },
    };
    const currentData = chartData || defaultChartData;
    const hasTraffic = currentData.series1?.values?.some((v) => v > 0) ||
        (currentData.series2?.values && currentData.series2.values.some((v) => v > 0));
    // Calculate SVG curve paths dynamically
    const svgWidth = 700;
    const svgHeight = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;
    const usableWidth = svgWidth - paddingLeft - paddingRight;
    const usableHeight = svgHeight - paddingTop - paddingBottom;
    const getX = (index) => {
        const total = currentData.labels?.length || 1;
        if (total <= 1)
            return paddingLeft;
        return paddingLeft + (index / (total - 1)) * usableWidth;
    };
    const getY = (val) => {
        const max = currentData.maxY || 10;
        const ratio = val / max;
        return paddingTop + (1 - ratio) * usableHeight;
    };
    // Generate smooth SVG Path string for series
    const generatePath = (values) => {
        if (!values || values.length === 0)
            return '';
        const points = values.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
        if (points.length === 1)
            return `M ${points[0].x} ${points[0].y}`;
        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cpX = (curr.x + next.x) / 2;
            path += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
        }
        return path;
    };
    // Real Best Performers Data (empty array if no data yet)
    const bestPerformers = (stats?.bestPerformers && Array.isArray(stats.bestPerformers))
        ? stats.bestPerformers
        : [];
    // Real Recent Links Data (empty array if no data yet)
    const recentLinks = (stats?.recentLinks && Array.isArray(stats.recentLinks) && stats.recentLinks.length > 0)
        ? stats.recentLinks.map((l) => ({
            id: l.id,
            shortSlug: l.shortSlug || l.id,
            title: l.title || l.name,
            views: l.views || 0,
            clicks: l.clicks || 0,
            country: l.country || '🇺🇸',
        }))
        : linksList.slice(0, 5).map((l) => ({
            id: l.id,
            shortSlug: l.shortSlug,
            title: l.name,
            views: l.views || 0,
            clicks: l.clicks || 0,
            country: l.country || '🇺🇸',
        }));
    // Filtered Your Links Table Data
    const filteredLinks = linksList.filter((l) => {
        const title = (l.name || l.title || '').toLowerCase();
        const slug = (l.shortSlug || '').toLowerCase();
        const query = tableSearch.toLowerCase().trim();
        const matchesSearch = !query || title.includes(query) || slug.includes(query);
        const matchesCountry = tableCountry === 'All countries' || (l.country || '').includes(tableCountry.slice(0, 4));
        return matchesSearch && matchesCountry;
    });
    const handleCopy = (slugOrId) => {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
        const linkUrl = `${origin}/r/${slugOrId}`;
        navigator.clipboard.writeText(linkUrl);
        setCopiedId(slugOrId);
        showToast(`Copied tracking link: ${linkUrl}`);
        setTimeout(() => setCopiedId(null), 2000);
    };
    const copyText = (text, id) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        showToast(`Copied to clipboard!`);
        setTimeout(() => setCopiedId(null), 2000);
    };
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
    const handleRemoveLink = async (row) => {
        if (!row || deletingId) return;
        const linkName = row.name || row.title || 'this affiliate link';
        const confirmDelete = window.confirm(`Are you sure you want to remove "${linkName}"?`);
        if (!confirmDelete) return;

        const targetId = row.id;
        const targetSlug = row.shortSlug;
        setDeletingId(targetId || targetSlug);

        try {
            const queryParam = targetId ? `id=${encodeURIComponent(targetId)}` : `slug=${encodeURIComponent(targetSlug)}`;
            const res = await authFetch(`/api/links?${queryParam}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setLinksList((prev) => prev.filter((l) => l.id !== targetId && l.shortSlug !== targetSlug));
                if (latestCreatedLink && (latestCreatedLink.id === targetId || latestCreatedLink.shortSlug === targetSlug)) {
                    setLatestCreatedLink(null);
                }
                showToast(`Removed link: ${linkName}`);
                loadData();
            } else {
                showToast(data.error || 'Failed to remove link');
            }
        } catch (err) {
            console.error('Error removing link:', err);
            showToast('Error removing link');
        } finally {
            setDeletingId(null);
        }
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
                setLatestCreatedLink(data.link);
                setCreatedLinkModal(data.link);
                setLinksList((prev) => [data.link, ...prev]);
                showToast(`Affiliate link ready for: ${data.link.name || 'product'}!`);
                setProductUrl('');
                loadData();
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
    return (<div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      
      {/* 1. Breadcrumb */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
        <span style={{ color: '#9CA3AF' }}>Home</span>
        <span>›</span>
        <span style={{ color: '#1E1B4B', fontWeight: 700 }}>Dashboard</span>
      </div>

      {/* 2. Create Link Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        
        {/* Link created notification box (matching user reference screenshot) */}
        {latestCreatedLink && (
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: '#EDFCF2',
              border: '1.5px solid #86EFAC',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.25rem',
              position: 'relative',
            }}
          >
            {/* Header: Circle Checkmark + "Link created" + Close X */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </div>
                <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#064E3B' }}>
                  Link created
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCreatedLinkModal(latestCreatedLink)}
                  style={{
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    color: '#065F46',
                    cursor: 'pointer',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}
                >
                  <Eye size={13} />
                  <span>Showcase Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLatestCreatedLink(null)}
                  title="Dismiss"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Box 1: Public Page */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>
                  Public Page
                </span>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: '#6366F1',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002'}/p/${latestCreatedLink.shortSlug || latestCreatedLink.id}`}
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyText(`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002'}/p/${latestCreatedLink.shortSlug || latestCreatedLink.id}`, 'public')}
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.25rem',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  minWidth: '72px',
                  textAlign: 'center',
                  transition: 'opacity 0.2s',
                }}
              >
                {copiedId === 'public' ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Box 2: Direct Amazon Link */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>
                  Direct Amazon Link
                </span>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.8438rem',
                  fontWeight: 600,
                  color: '#475569',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {latestCreatedLink.affiliateUrl || latestCreatedLink.destinationUrl}
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyText(latestCreatedLink.affiliateUrl || latestCreatedLink.destinationUrl, 'direct')}
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.25rem',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  minWidth: '72px',
                  textAlign: 'center',
                  transition: 'opacity 0.2s',
                }}
              >
                {copiedId === 'direct' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Input Form matching user reference screenshot */}
        <form onSubmit={handleCreateLink} className="create-link-form responsive-flex-column" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Paste an Amazon or Walmart product URL"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            className="input-field"
            style={{ borderRadius: '10px', fontSize: '0.9375rem', flex: 1, padding: '0.75rem 1rem' }}
          />
          <button
            type="submit"
            disabled={isCreating}
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '0.75rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.9375rem',
              whiteSpace: 'nowrap',
              cursor: isCreating ? 'not-allowed' : 'pointer',
              opacity: isCreating ? 0.75 : 1,
            }}
          >
            {isCreating ? 'Creating...' : 'Create link'}
          </button>
        </form>

        {/* or create via WhatsApp line */}
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
          <span style={{ color: '#6B7280' }}>or</span>
          <button
            type="button"
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
            <MessageCircle size={16} fill="#10B981" color="#FFFFFF"/>
            <span>create via WhatsApp</span>
          </button>
          <HelpCircle size={14} color="#9CA3AF" style={{ cursor: 'pointer' }}/>
        </div>
      </div>

      {/* 3. CURRENTLY OWED Banner */}
      <div className="ilearner-card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--brand-shadow-md)' }}>
        <div className="owed-banner-header" style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #06B6D4 100%)',
            color: '#FFFFFF',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', opacity: 0.9 }}>
              CURRENTLY OWED
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0.25rem 0' }}>
              Rs. {stats?.currentlyOwed !== undefined ? Number(stats.currentlyOwed).toLocaleString() : '0'}
            </div>
            <span style={{ fontSize: '0.8438rem', opacity: 0.85 }}>What we still owe you</span>
          </div>

          <a href="/dashboard" style={{ fontSize: '0.8438rem', fontWeight: 600, color: '#FFFFFF', textDecoration: 'underline' }}>
            Earnings history ›
          </a>
        </div>

        <div style={{ backgroundColor: '#FFFFFF' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B' }}>Current Period</div>
              <span style={{ fontSize: '0.8125rem', color: (stats?.currentlyOwed > 0) ? '#D97706' : '#6B7280', fontWeight: 600 }}>
                {stats?.currentlyOwed > 0 ? '⏳ Pending Amazon Settlement' : 'No pending settlements'}
              </span>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1E1B4B' }}>
              Rs. {stats?.currentlyOwed !== undefined ? Number(stats.currentlyOwed).toLocaleString() : '0'}
            </div>
          </div>

          <div style={{ padding: '1.125rem 1.5rem', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block', fontWeight: 500 }}>Lifetime Earnings</span>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>
                Rs. {stats?.lifetimeEarnings !== undefined ? Number(stats.lifetimeEarnings).toLocaleString() : '0'}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block', fontWeight: 500 }}>Total Paid Out</span>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E1B4B' }}>
                Rs. {stats?.totalPaidOut !== undefined ? Number(stats.totalPaidOut).toLocaleString() : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Four Big Metrics Card Grid */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06B6D4' }}>
              {stats?.views !== undefined ? stats.views : 0}
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Total Views</span>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>
              {stats?.clicks !== undefined ? stats.clicks : 0}
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Product Clicks</span>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0EA5E9' }}>
              {stats?.links !== undefined ? stats.links : 0}
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Active Links</span>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B' }}>
              {stats?.conversion || '0.0%'}
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Conversion Rate</span>
          </div>
        </div>
      </div>


      {/* 5. FULLY DYNAMIC & INTERACTIVE GRAPH CARD */}
      <div className="ilearner-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
          {['7-Day Trends', 'Monthly', 'Revenue', 'Top Products'].map((tab) => {
            const isActive = activeChartTab === tab;
            return (<button key={tab} onClick={() => {
                    setActiveChartTab(tab);
                    setHoveredPointIndex(null);
                }} style={{
                    padding: '1rem 1.5rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.875rem',
                    color: isActive ? '#1E1B4B' : '#6B7280',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.2s',
                }}>
                {tab}
                {isActive && (<div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: '#06B6D4',
                        borderRadius: '3px 3px 0 0',
                    }}/>)}
              </button>);
        })}
        </div>

        {/* Dynamic Chart Container */}
        <div style={{ padding: '1.5rem', width: '100%', position: 'relative' }}>
          
          {/* Series Legend Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: currentData.series1.color }}/>
              <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{currentData.series1.name}</span>
            </div>
            {currentData.series2 && (<div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: currentData.series2.color }}/>
                <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{currentData.series2.name}</span>
              </div>)}
          </div>

          {/* Interactive SVG Render Area */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg width="100%" height="180" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
              
              {/* Dashed Horizontal Y Gridlines */}
              {currentData.yTicks.slice(0, 4).map((tick, i) => {
            const y = getY(tick);
            return (<g key={i}>
                    <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1"/>
                    <text x="5" y={y + 4} fill="#94A3B8" fontSize="11" fontWeight="600">{tick}</text>
                  </g>);
        })}

              {/* Dynamic Line Paths */}
              <path d={generatePath(currentData.series1.values)} fill="none" stroke={currentData.series1.color} strokeWidth="3" style={{ transition: 'd 0.3s ease' }}/>

              {currentData.series2 && (<path d={generatePath(currentData.series2.values)} fill="none" stroke={currentData.series2.color} strokeWidth="3" style={{ transition: 'd 0.3s ease' }}/>)}

              {/* Dynamic Data Circles & Interactive Hover Hits */}
              {currentData.labels.map((_, index) => {
            const x = getX(index);
            const y1 = getY(currentData.series1.values[index]);
            const isHovered = hoveredPointIndex === index;
            return (<g key={index}>
                    {/* Hover vertical line */}
                    {isHovered && (<line x1={x} y1={paddingTop} x2={x} y2={svgHeight - paddingBottom} stroke="#7C00FF" strokeDasharray="3 3" strokeWidth="1.5"/>)}

                    {/* Circle Point Series 1 */}
                    <circle cx={x} cy={y1} r={isHovered ? 6 : 4} fill="#FFFFFF" stroke={currentData.series1.color} strokeWidth={isHovered ? 3 : 2.5} style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}/>

                    {/* Circle Point Series 2 */}
                    {currentData.series2 && (<circle cx={x} cy={getY(currentData.series2.values[index])} r={isHovered ? 6 : 4} fill="#FFFFFF" stroke={currentData.series2.color} strokeWidth={isHovered ? 3 : 2.5} style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}/>)}

                    {/* Invisible Hitbox area for hover */}
                    <rect x={x - 20} y={0} width={40} height={svgHeight} fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPointIndex(index)} onMouseLeave={() => setHoveredPointIndex(null)}/>
                  </g>);
        })}
            </svg>

            {/* Floating Tooltip Popup on Hover */}
            {hoveredPointIndex !== null && (<div className="animate-fade-in" style={{
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
            }}>
                <div style={{ fontWeight: 800, color: '#A5B4FC', marginBottom: '0.25rem' }}>
                  {currentData.labels[hoveredPointIndex]}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <span>{currentData.series1.name}:</span>
                  <span style={{ fontWeight: 800 }}>{currentData.series1.values[hoveredPointIndex]}</span>
                </div>
                {currentData.series2 && (<div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span>{currentData.series2.name}:</span>
                    <span style={{ fontWeight: 800 }}>{currentData.series2.values[hoveredPointIndex]}</span>
                  </div>)}
              </div>)}

            {!hasTraffic && (<div style={{
                position: 'absolute',
                inset: '10px 10px 35px 35px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(3px)',
                borderRadius: '12px',
                textAlign: 'center',
                padding: '1rem',
                zIndex: 10,
            }}>
                <BarChart3 size={28} color="#94A3B8" style={{ marginBottom: '0.375rem' }}/>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>
                  No traffic recorded for this period
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  Create and share your affiliate tracking links to see live trends here!
                </div>
              </div>)}

            {/* Dynamic X-Axis Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '35px', paddingRight: '15px', marginTop: '0.5rem', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
              {currentData.labels.map((lbl, idx) => (<span key={idx} style={{
                color: hoveredPointIndex === idx ? '#7C00FF' : '#94A3B8',
                fontWeight: hoveredPointIndex === idx ? 800 : 600,
            }}>
                  {lbl}
                </span>))}
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
          {bestPerformers.length === 0 ? (<div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6B7280' }}>
              <TrendingUp size={28} color="#94A3B8" style={{ margin: '0 auto 0.5rem', display: 'block' }}/>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>No performance data available</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Your top converting Amazon links will appear here once you receive clicks.</div>
            </div>) : (bestPerformers.map((item, index) => (<div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', color: '#6B7280', flex: 1, overflow: 'hidden' }}>
                  <span style={{ width: '16px', color: '#9CA3AF' }}>{index + 1}</span>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#374151' }}>
                    {item.title}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600 }}>
                  <span style={{ color: '#00C875' }}>{item.clicks || 0} clicks</span>
                  <span style={{ color: '#9CA3AF' }}>{item.conv || '0.0%'} conv</span>
                </div>
              </div>)))}
        </div>
      </div>

      {/* 7 & 8. Today & Last 7 Days Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <div style={{ backgroundColor: '#00C875', color: '#FFFFFF', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 4px 12px rgba(0, 200, 117, 0.2)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Today</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Views</span>
              <span style={{ fontWeight: 800 }}>{stats?.todayViews ?? 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Clicks</span>
              <span style={{ fontWeight: 800 }}>{stats?.todayClicks ?? 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>New Links</span>
              <span style={{ fontWeight: 800 }}>{stats?.todayLinks ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="ilearner-card" style={{ padding: '1.25rem 1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#1E1B4B' }}>Last 7 Days</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Views</span>
              <span style={{ fontWeight: 800, color: '#7C00FF' }}>{stats?.last7DaysViews ?? 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Clicks</span>
              <span style={{ fontWeight: 800, color: '#00C875' }}>{stats?.last7DaysClicks ?? 0}</span>
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

        <button onClick={() => showToast('Opening WhatsApp link generator...')} style={{
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
        }}>
          <MessageCircle size={18} fill="#047857" color="#ECFDF5"/>
          <span>Link WhatsApp for quick links</span>
        </button>
      </div>

      {/* 10. How We Calculate Earnings Banner */}
      <div style={{
            backgroundColor: '#7C00FF',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--brand-shadow-md)',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={20} color="#FFFFFF"/>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>How we calculate earnings</h4>
            <span style={{ fontSize: '0.8125rem', opacity: 0.85 }}>See our transparency process</span>
          </div>
        </div>

        <ChevronRight size={22} color="#FFFFFF"/>
      </div>

      {/* 11. Recent Links Card */}
      <div className="ilearner-card" style={{ padding: '1.25rem 1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E1B4B' }}>Recent Links</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentLinks.length === 0 ? (<div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6B7280' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>No recent links found</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Generated links will appear here for quick copying and sharing.</div>
            </div>) : (recentLinks.map((link) => (<div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E1B4B', marginBottom: '0.125rem' }}>
                    {link.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    {link.country || '🇺🇸'} {link.views || 0} views • {link.clicks || 0} clicks
                  </div>
                </div>

                <button onClick={() => handleCopy(link.shortSlug || link.id)} style={{
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
            }}>
                  {copiedId === (link.shortSlug || link.id) ? <Check size={14} color="#059669"/> : <Copy size={14}/>}
                  <span>{copiedId === (link.shortSlug || link.id) ? 'Copied' : 'Copy'}</span>
                </button>
              </div>)))}
        </div>
      </div>

      {/* 12. Your Links Filtered Table Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem 1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', color: '#1E1B4B' }}>Your Links</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select value={tableCountry} onChange={(e) => setTableCountry(e.target.value)} className="input-field" style={{ width: 'auto', minWidth: '130px', padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}>
              <option>All countries</option>
              <option>United States 🇺🇸</option>
              <option>Pakistan 🇵🇰</option>
            </select>

            <input type="text" placeholder="Search title/description or slug..." value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} className="input-field" style={{ flex: 1, minWidth: '180px', padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}/>

            {(tableSearch || tableCountry !== 'All countries') && (<button onClick={() => {
                setTableSearch('');
                setTableCountry('All countries');
            }} style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#4B5563',
                cursor: 'pointer',
            }}>
                Clear filter
              </button>)}
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
              {linksList.length === 0 ? (<tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#6B7280' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1E1B4B', marginBottom: '0.375rem' }}>No tracking links created yet</div>
                    <div style={{ fontSize: '0.8438rem', color: '#64748B' }}>Paste any Amazon product URL in the input above to generate your first link!</div>
                  </td>
                </tr>) : filteredLinks.length === 0 ? (<tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#6B7280' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>No links match your filter</div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Try clearing the search or changing the filter.</div>
                  </td>
                </tr>) : (filteredLinks.map((row) => (<tr key={row.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#1E1B4B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span>{row.country || '🇺🇸'}</span>
                        <span>{row.name || row.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#6B7280' }}>
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>
                      {row.views || 0}
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>
                      {row.clicks || 0}
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                        <button onClick={() => handleCopy(row.shortSlug || row.id)} style={{
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
            }}>
                          {copiedId === (row.shortSlug || row.id) ? <Check size={12} color="#059669"/> : <Copy size={12}/>}
                          {copiedId === (row.shortSlug || row.id) ? 'Copied' : 'Copy'}
                        </button>

                        <a href={`/p/${row.shortSlug || row.id}`} target="_blank" rel="noopener noreferrer" style={{
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
                textDecoration: 'none',
            }}>
                          <ExternalLink size={12}/>
                          View
                        </a>

                        <button
                          type="button"
                          disabled={deletingId === (row.id || row.shortSlug)}
                          onClick={() => handleRemoveLink(row)}
                          title="Permanently remove this link"
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
                            gap: '0.35rem',
                            cursor: deletingId === (row.id || row.shortSlug) ? 'not-allowed' : 'pointer',
                            opacity: deletingId === (row.id || row.shortSlug) ? 0.6 : 1,
                            transition: 'all 0.15s ease-in-out',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FEE2E2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FEF2F2';
                          }}
                        >
                          <Trash2 size={12} />
                          <span>{deletingId === (row.id || row.shortSlug) ? 'Removing...' : 'Remove'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 13. Floating Gift Widget */}
      {showGiftWidget && (<div style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
            }}>
          <button onClick={() => setShowGiftWidget(false)} style={{
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
            }}>
            <X size={12} color="#6B7280"/>
          </button>

          <div onClick={() => showToast('Claim partner bonus reward!')} style={{
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
            }}>
            <span style={{ fontSize: '1.75rem' }}>🎁</span>
            <span style={{
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
            }}>
              2
            </span>
          </div>
        </div>)}

      {/* Showcase Web Page Created Modal via Portal */}
      <ShowcaseCreatedModal
        isOpen={Boolean(createdLinkModal)}
        onClose={() => setCreatedLinkModal(null)}
        link={createdLinkModal}
        showToast={showToast}
      />
    </div>);
}
