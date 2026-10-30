'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import ShowcaseCreatedModal from '@/components/ShowcaseCreatedModal';
import { MessageCircle, ArrowRight, Copy, Sparkles, Eye, X, Zap, Search, HelpCircle, ExternalLink } from 'lucide-react';
import { getAuthToken, getCurrentUser, authFetch, logout } from '@/utils/auth';

export default function CreateAffiliateLinkPage() {
    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.replace('/login');
            return;
        }
        const cached = getCurrentUser();
        if (cached && cached.status === 'suspended') {
            logout('suspended');
            return;
        }
        authFetch('/api/auth/me')
            .then(res => {
                if (res.status === 403) {
                    logout('suspended');
                    return;
                }
                if (!res.ok) {
                    logout('expired');
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data && data.success && data.user) {
                    if (data.user.status === 'suspended') {
                        logout('suspended');
                        return;
                    }
                    setIsVerifying(false);
                } else {
                    logout();
                }
            })
            .catch(() => logout());
    }, [router]);
    const [amazonUrl, setAmazonUrl] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('🇺🇸');
    const [customSlug, setCustomSlug] = useState('');
    const [showCustomSlug, setShowCustomSlug] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdLinkItem, setCreatedLinkItem] = useState(null);
    const [toastMsg, setToastMsg] = useState(null);
    const [copiedType, setCopiedType] = useState(null);
    const marketplaces = [
        { code: '🇺🇸', name: 'United States', domain: '.com' },
        { code: '🇬🇧', name: 'United Kingdom', domain: '.co.uk' },
        { code: '🇨🇦', name: 'Canada', domain: '.ca' },
        { code: '🇩🇪', name: 'Germany', domain: '.de' },
        { code: '🇮🇳', name: 'India', domain: '.in' },
        { code: '🇦🇺', name: 'Australia', domain: '.com.au' },
    ];
    const [linksList, setLinksList] = useState([]);
    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3200);
    };
    useEffect(() => {
        async function loadLinks() {
            try {
                const res = await authFetch('/api/links');
                if (res.status === 401) {
                    logout();
                    return;
                }
                const data = await res.json();
                if (data.success && Array.isArray(data.links)) {
                    setLinksList(data.links);
                }
            }
            catch (err) {
                console.error('Error loading links:', err);
            }
        }
        if (!isVerifying) {
            loadLinks();
        }
    }, [isVerifying]);
    const handleCreateLink = async (e) => {
        e.preventDefault();
        if (!amazonUrl.trim()) {
            showToast('Please enter a valid Amazon product URL or ASIN');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await authFetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destinationUrl: amazonUrl,
                    customSlug: customSlug.trim() || undefined,
                    country: selectedCountry,
                }),
            });
            const data = await res.json();
            if (data.success && data.link) {
                setCreatedLinkItem(data.link);
                setLinksList((prev) => [data.link, ...prev]);
                setAmazonUrl('');
                setCustomSlug('');
                showToast('Affiliate tracking link & showcase page generated successfully!');
            }
            else {
                showToast(data.error || 'Failed to create affiliate link');
            }
        }
        catch (err) {
            console.error(err);
            showToast('Error creating affiliate link');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleWhatsAppCreate = () => {
        const defaultMsg = amazonUrl
            ? `Hi LinkCraft, please generate an affiliate link and showcase page for: ${amazonUrl}`
            : `Hi LinkCraft, I want to generate an Amazon product showcase page.`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(defaultMsg)}`;
        window.open(whatsappUrl, '_blank');
        showToast('Opening WhatsApp link generator...');
    };
    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopiedType(type);
        showToast('Copied to clipboard!');
        setTimeout(() => setCopiedType(null), 2000);
    };
    const getFullUrl = (path) => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}${path}`;
        }
        return `https://linkcraft.dev${path}`;
    };
    const filteredLinks = linksList.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.asin && l.asin.toLowerCase().includes(searchQuery.toLowerCase())));

    if (isVerifying) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F1F5F9',
            }}>
                <div style={{
                    width: '42px',
                    height: '42px',
                    border: '3px solid #6366F1',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '1rem',
                }} />
                <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.9375rem' }}>
                    Verifying authorization...
                </p>
            </div>
        );
    }

    return (<div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', color: '#0F172A' }}>
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        
        {/* Studio Top Banner Bar */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
              <span style={{ backgroundColor: '#ECFEFF', color: '#0891B2', padding: '0.25rem 0.625rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Zap size={12} fill="#0891B2"/> Engine v2.4 Active
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                Collision-Free Attribution Protection
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              Amazon Link & Showcase Studio
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.375rem', maxWidth: '640px', lineHeight: 1.5 }}>
              Paste any Amazon product URL to automatically generate shareable product showcase web pages and direct affiliate tracking links.
            </p>
          </div>

          <Link href="/dashboard" style={{
            padding: '0.75rem 1.375rem',
            borderRadius: '12px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.875rem',
            textDecoration: 'none',
            transition: 'transform 0.15s, background-color 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
        }}>
            <span>Go to Dashboard</span>
            <ArrowRight size={16} color="#06B6D4"/>
          </Link>
        </div>

        {/* Studio 2-Column Grid */}
        <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
          
          {/* Left Column: Link Converter Studio */}
          <div className="ilearner-card" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
            {/* Top Teal Gradient Line */}
            <div style={{ height: '5px', background: 'linear-gradient(90deg, #06B6D4 0%, #F59E0B 100%)' }}/>

            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#ECFEFF', color: '#06B6D4' }}>
                  <Sparkles size={20}/>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
                  Product Showcase Converter
                </h3>
              </div>

              <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Marketplace Domain Chips */}
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
                    Select Target Marketplace
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {marketplaces.map((m) => {
            const isSelected = selectedCountry === m.code;
            return (<button key={m.code} type="button" onClick={() => setSelectedCountry(m.code)} style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #06B6D4' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#ECFEFF' : '#FFFFFF',
                    color: isSelected ? '#0891B2' : '#475569',
                    fontWeight: isSelected ? 700 : 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    transition: 'all 0.15s'
                }}>
                          <span>{m.code}</span>
                          <span>{m.domain}</span>
                        </button>);
        })}
                  </div>
                </div>

                {/* URL Input Box */}
                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <label style={{ color: '#0F172A', fontWeight: 800, fontSize: '0.875rem' }}>
                      Amazon Product URL or ASIN
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                      ✓ Auto Tag Attached
                    </span>
                  </div>

                  <input type="text" placeholder="https://www.amazon.com/dp/B08X123456..." value={amazonUrl} onChange={(e) => setAmazonUrl(e.target.value)} className="input-field" style={{ fontSize: '0.875rem' }}/>
                  <span style={{ fontSize: '0.7813rem', color: '#64748B', marginTop: '0.375rem', display: 'block' }}>
                    Paste the full Amazon item URL from browser or Amazon app share link.
                  </span>
                </div>

                {/* Custom Slug Expander */}
                <div>
                  <button type="button" onClick={() => setShowCustomSlug(!showCustomSlug)} style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span>{showCustomSlug ? '− Hide Custom Vanity Slug' : '+ Add Custom Vanity Slug (Optional)'}</span>
                  </button>

                  {showCustomSlug && (<div style={{ marginTop: '0.625rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                        Custom Short Slug
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: '#94A3B8', fontFamily: 'monospace' }}>/p/</span>
                        <input type="text" placeholder="top-deals-2026" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} className="input-field" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontFamily: 'monospace' }}/>
                      </div>
                    </div>)}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="submit" disabled={isSubmitting} className="btn-teal" style={{
            width: '100%',
            padding: '0.9375rem',
            fontSize: '0.9375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            opacity: isSubmitting ? 0.8 : 1,
        }}>
                    {isSubmitting ? (<>
                        <div style={{ width: '18px', height: '18px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
                        <span>Generating Showcase & Link...</span>
                      </>) : (<>
                        <Zap size={18}/>
                        <span>Generate Showcase & Affiliate Link</span>
                      </>)}
                  </button>

                  <button type="button" onClick={handleWhatsAppCreate} style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '12px',
            backgroundColor: '#ECFDF5',
            color: '#10B981',
            border: '1px solid #A7F3D0',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
        }}>
                    <MessageCircle size={17} fill="#10B981" color="#ECFDF5"/>
                    <span>Generate via WhatsApp Bot</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Workflow & System Info Hub */}
          <div className="ilearner-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
                  How Showcase Engine Works
                </h3>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#FFFBEB', color: '#D97706', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                  4-Step Workflow
                </span>
              </div>

              {/* 4 Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#06B6D4', color: '#FFFFFF', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>Paste Product Link</span>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Enter any Amazon product URL or ASIN identifier.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#06B6D4', color: '#FFFFFF', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>Attribution Protection</span>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Attaches Amazon Associate tag with collision safety.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#06B6D4', color: '#FFFFFF', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>Shareable Web Page</span>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Generates hosted product showcase page at <code>/p/[slug]</code>.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#F59E0B', color: '#FFFFFF', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    4
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>Capture Commissions</span>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Direct traffic to Amazon & collect Associate earnings.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Desk Trigger Card */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.8438rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>Need Help or Setup Support?</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>24/7 Support Desk Available</span>
              </div>
              <button onClick={() => showToast('Support assistance is ready at support@linkcraft.dev')} style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '10px',
            backgroundColor: '#F8FAFC',
            color: '#0284C7',
            border: '1px solid #E2E8F0',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
        }}>
                <HelpCircle size={15}/>
                <span>Contact Desk</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Panel: Live Link Manager & Showcase Gallery */}
        <div className="ilearner-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
                Your Generated Showcase Pages & Links
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.125rem' }}>
                Manage hosted product showcase pages, direct short URLs, and click analytics
              </p>
            </div>

            {/* Filter Input */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}/>
              <input type="text" placeholder="Search by title or ASIN..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field" style={{ paddingLeft: '2.375rem', padding: '0.45rem 0.875rem', fontSize: '0.8125rem' }}/>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8438rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.875rem 0.5rem', fontWeight: 700 }}>Amazon Item</th>
                  <th style={{ padding: '0.875rem 0.5rem', fontWeight: 700, textAlign: 'center' }}>Clicks</th>
                  <th style={{ padding: '0.875rem 0.5rem', fontWeight: 700, textAlign: 'center' }}>Rating</th>
                  <th style={{ padding: '0.875rem 0.5rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                      <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🔗</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A', marginBottom: '0.25rem' }}>No affiliate links created yet</div>
                      <div style={{ fontSize: '0.8125rem' }}>Generate your first link using the form above. Links created here will only be visible to your account.</div>
                    </td>
                  </tr>
                ) : filteredLinks.map((link, idx) => (<tr key={link.id || idx} style={{
                borderBottom: '1px solid #F1F5F9',
                backgroundColor: idx % 2 === 1 ? '#F8FAFC' : 'transparent',
            }}>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {link.imageUrl ? (<img src={link.imageUrl} alt="" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }}/>) : (<div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#06B6D4' }}>
                            {link.country || '🇺🇸'}
                          </div>)}
                        <div>
                          <a
                            href={getFullUrl(link.shortUrl || `/r/${link.shortSlug}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontWeight: 700,
                              color: '#0F172A',
                              maxWidth: '420px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'block',
                              textDecoration: 'none',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#06B6D4')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#0F172A')}
                            title="Open tracking link in new tab"
                          >
                            {link.name}
                          </a>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748B', marginTop: '0.125rem' }}>
                            <span>{link.country || '🇺🇸'}</span>
                            <span>•</span>
                            <span style={{ fontFamily: 'monospace' }}>ASIN: {link.asin || link.shortSlug.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 700, color: '#0F172A', textAlign: 'center' }}>
                      {link.clicks}
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 700, color: '#D97706', textAlign: 'center' }}>
                      {link.rating || '5.0 ★'}
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {/* Open Direct Tracking Link */}
                        <a
                          href={getFullUrl(link.shortUrl || `/r/${link.shortSlug}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.3125rem 0.625rem',
                            borderRadius: '8px',
                            backgroundColor: '#F0FDF4',
                            color: '#16A34A',
                            border: '1px solid #BBF7D0',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                          title="Open tracking link in new tab"
                        >
                          <ExternalLink size={13} />
                          <span>Open</span>
                        </a>

                        {/* View Web Showcase Page */}
                        <Link href={link.showcaseUrl || `/p/${link.shortSlug}`} target="_blank" style={{
                padding: '0.3125rem 0.625rem',
                borderRadius: '8px',
                backgroundColor: '#ECFEFF',
                color: '#0891B2',
                border: '1px solid #CFFAFE',
                fontWeight: 700,
                fontSize: '0.75rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
            }}>
                          <Eye size={13}/>
                          <span>Showcase</span>
                        </Link>

                        {/* Copy Direct Tracking Link */}
                        <button onClick={() => copyToClipboard(getFullUrl(link.shortUrl || `/r/${link.shortSlug}`), `tbl-${idx}`)} style={{
                padding: '0.3125rem 0.625rem',
                borderRadius: '8px',
                backgroundColor: '#F1F5F9',
                color: '#334155',
                border: '1px solid #E2E8F0',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
            }}>
                          <Copy size={13}/>
                          <span>{copiedType === `tbl-${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Generated Link Creation Confirmation Modal via Portal */}
      <ShowcaseCreatedModal
        isOpen={Boolean(createdLinkItem)}
        onClose={() => setCreatedLinkItem(null)}
        link={createdLinkItem}
        showToast={showToast}
      />

      {/* Toast Notification */}
      <Toast message={toastMsg}/>

      {/* Footer */}
      <footer style={{ marginTop: '3rem', padding: '1.5rem 0', textAlign: 'center', color: '#94A3B8', fontSize: '0.8125rem', borderTop: '1px solid #E2E8F0' }}>
        © 2026 LinkCraft Engine. All rights reserved.
      </footer>
    </div>);
}
