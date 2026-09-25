'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import {
  MessageCircle,
  ArrowRight,
  Star,
  Copy,
  ExternalLink,
  Check,
  Sparkles,
  Globe,
  Eye,
  Link2,
  X,
  Zap,
  ShieldCheck,
  Layers,
  Search,
  CheckCircle2,
  HelpCircle,
  Share2
} from 'lucide-react';

interface LinkItem {
  id: string;
  name: string;
  destinationUrl: string;
  affiliateUrl?: string;
  shortSlug: string;
  shortUrl: string;
  showcaseUrl: string;
  country: string;
  clicks: number;
  views: number;
  rating: string;
  price?: string;
  imageUrl?: string;
  asin?: string;
  createdAt: string;
}

export default function CreateAffiliateLinkPage() {
  const router = useRouter();
  const [amazonUrl, setAmazonUrl] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('🇺🇸');
  const [customSlug, setCustomSlug] = useState('');
  const [showCustomSlug, setShowCustomSlug] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdLinkItem, setCreatedLinkItem] = useState<LinkItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const marketplaces = [
    { code: '🇺🇸', name: 'United States', domain: '.com' },
    { code: '🇬🇧', name: 'United Kingdom', domain: '.co.uk' },
    { code: '🇨🇦', name: 'Canada', domain: '.ca' },
    { code: '🇩🇪', name: 'Germany', domain: '.de' },
    { code: '🇮🇳', name: 'India', domain: '.in' },
    { code: '🇦🇺', name: 'Australia', domain: '.com.au' },
  ];

  const [linksList, setLinksList] = useState<LinkItem[]>([
    {
      id: 'lnk-1',
      name: 'Men Women Custom Cotton T Shirts Personalized Print & Comfort Fit',
      destinationUrl: 'https://www.amazon.com/dp/B08X123456',
      shortSlug: 'b08x123456',
      shortUrl: '/r/b08x123456',
      showcaseUrl: '/p/b08x123456',
      clicks: 12,
      views: 45,
      rating: '5.0 ★',
      country: '🇺🇸',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      asin: 'B08X123456',
      createdAt: '9/14/2026'
    },
    {
      id: 'lnk-2',
      name: 'YASHINE Car Wash Foam Gun Kit for Garden Hose, Heavy Duty Spray',
      destinationUrl: 'https://www.amazon.com/dp/B08Y987654',
      shortSlug: 'b08y987654',
      shortUrl: '/r/b08y987654',
      showcaseUrl: '/p/b08y987654',
      clicks: 8,
      views: 28,
      rating: '4.8 ★',
      country: '🇺🇸',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      asin: 'B08Y987654',
      createdAt: '9/14/2026'
    },
    {
      id: 'lnk-3',
      name: 'JSELF 3 Inch Gel Memory Foam Mattress Topper, Dual-Layer Breathable',
      destinationUrl: 'https://www.amazon.com/dp/B07Z111222',
      shortSlug: 'b07z111222',
      shortUrl: '/r/b07z111222',
      showcaseUrl: '/p/b07z111222',
      clicks: 34,
      views: 89,
      rating: '4.5 ★',
      country: '🇺🇸',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      asin: 'B07Z111222',
      createdAt: '9/14/2026'
    },
    {
      id: 'lnk-4',
      name: '3-in-1 Dough Toy Set, 24 Color Kitchen Food Tools for Kids',
      destinationUrl: 'https://www.amazon.com/dp/B09DOUGH01',
      shortSlug: 'b09dough01',
      shortUrl: '/r/b09dough01',
      showcaseUrl: '/p/b09dough01',
      clicks: 5,
      views: 18,
      rating: '4.2 ★',
      country: '🇺🇸',
      asin: 'B09DOUGH01',
      createdAt: '9/14/2026'
    },
    {
      id: 'lnk-5',
      name: 'HENMI Car Dehumidifier Bags with Non-Slip Mat, 400g × 2',
      destinationUrl: 'https://www.amazon.co.uk/dp/B09HUM055',
      shortSlug: 'b09hum055',
      shortUrl: '/r/b09hum055',
      showcaseUrl: '/p/b09hum055',
      clicks: 19,
      views: 52,
      rating: '4.3 ★',
      country: '🇬🇧',
      asin: 'B09HUM055',
      createdAt: '9/14/2026'
    },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  useEffect(() => {
    async function loadLinks() {
      try {
        const res = await fetch('/api/links');
        const data = await res.json();
        if (data.success && data.links && data.links.length > 0) {
          setLinksList(data.links);
        }
      } catch (err) {
        console.error('Error loading links:', err);
      }
    }
    loadLinks();
  }, []);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amazonUrl.trim()) {
      showToast('Please enter a valid Amazon product URL or ASIN');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/links', {
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
      } else {
        showToast(data.error || 'Failed to create affiliate link');
      }
    } catch (err) {
      console.error(err);
      showToast('Error creating affiliate link');
    } finally {
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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getFullUrl = (path: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${path}`;
    }
    return `https://linkcraft.dev${path}`;
  };

  const filteredLinks = linksList.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (l.asin && l.asin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', color: '#0F172A' }}>
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        
        {/* Studio Top Banner Bar */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
              <span style={{ backgroundColor: '#ECFEFF', color: '#0891B2', padding: '0.25rem 0.625rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Zap size={12} fill="#0891B2" /> Engine v2.4 Active
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

          <Link
            href="/dashboard"
            style={{
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
            }}
          >
            <span>Go to Dashboard</span>
            <ArrowRight size={16} color="#06B6D4" />
          </Link>
        </div>

        {/* Studio 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
          
          {/* Left Column: Link Converter Studio */}
          <div className="ilearner-card" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
            {/* Top Teal Gradient Line */}
            <div style={{ height: '5px', background: 'linear-gradient(90deg, #06B6D4 0%, #F59E0B 100%)' }} />

            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#ECFEFF', color: '#06B6D4' }}>
                  <Sparkles size={20} />
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
                      return (
                        <button
                          key={m.code}
                          type="button"
                          onClick={() => setSelectedCountry(m.code)}
                          style={{
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
                          }}
                        >
                          <span>{m.code}</span>
                          <span>{m.domain}</span>
                        </button>
                      );
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

                  <input
                    type="text"
                    placeholder="https://www.amazon.com/dp/B08X123456..."
                    value={amazonUrl}
                    onChange={(e) => setAmazonUrl(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.875rem' }}
                  />
                  <span style={{ fontSize: '0.7813rem', color: '#64748B', marginTop: '0.375rem', display: 'block' }}>
                    Paste the full Amazon item URL from browser or Amazon app share link.
                  </span>
                </div>

                {/* Custom Slug Expander */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowCustomSlug(!showCustomSlug)}
                    style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <span>{showCustomSlug ? '− Hide Custom Vanity Slug' : '+ Add Custom Vanity Slug (Optional)'}</span>
                  </button>

                  {showCustomSlug && (
                    <div style={{ marginTop: '0.625rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                        Custom Short Slug
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: '#94A3B8', fontFamily: 'monospace' }}>/p/</span>
                        <input
                          type="text"
                          placeholder="top-deals-2026"
                          value={customSlug}
                          onChange={(e) => setCustomSlug(e.target.value)}
                          className="input-field"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-teal"
                    style={{
                      width: '100%',
                      padding: '0.9375rem',
                      fontSize: '0.9375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: isSubmitting ? 0.8 : 1,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{ width: '18px', height: '18px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        <span>Generating Showcase & Link...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        <span>Generate Showcase & Affiliate Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppCreate}
                    style={{
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
                    }}
                  >
                    <MessageCircle size={17} fill="#10B981" color="#ECFDF5" />
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
              <button
                onClick={() => showToast('Support assistance is ready at support@linkcraft.dev')}
                style={{
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
                }}
              >
                <HelpCircle size={15} />
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
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by title or ASIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.375rem', padding: '0.45rem 0.875rem', fontSize: '0.8125rem' }}
              />
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
                {filteredLinks.map((link, idx) => (
                  <tr
                    key={link.id || idx}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: idx % 2 === 1 ? '#F8FAFC' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {link.imageUrl ? (
                          <img
                            src={link.imageUrl}
                            alt=""
                            style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                          />
                        ) : (
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#06B6D4' }}>
                            {link.country || '🇺🇸'}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F172A', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {link.name}
                          </div>
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
                        {/* View Web Showcase Page */}
                        <Link
                          href={link.showcaseUrl || `/p/${link.shortSlug}`}
                          target="_blank"
                          style={{
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
                          }}
                        >
                          <Eye size={13} />
                          <span>Showcase</span>
                        </Link>

                        {/* Copy Direct Tracking Link */}
                        <button
                          onClick={() => copyToClipboard(getFullUrl(link.shortUrl || `/r/${link.shortSlug}`), `tbl-${idx}`)}
                          style={{
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
                          }}
                        >
                          <Copy size={13} />
                          <span>{copiedType === `tbl-${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Generated Link Creation Confirmation Modal */}
      {createdLinkItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setCreatedLinkItem(null)}
        >
          <div
            className="ilearner-card animate-fade-in"
            style={{ width: '100%', maxWidth: '560px', padding: '2rem', position: 'relative', borderRadius: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCreatedLinkItem(null)}
              style={{
                position: 'absolute',
                right: '1.25rem',
                top: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.625rem', borderRadius: '12px', backgroundColor: '#ECFEFF' }}>
                <Sparkles size={24} color="#06B6D4" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                  Showcase Web Page Created!
                </h3>
                <p style={{ fontSize: '0.8438rem', color: '#64748B' }}>
                  Your Amazon Associate attribution page is live and ready to share.
                </p>
              </div>
            </div>

            {/* Product Summary Preview */}
            <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06B6D4', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Amazon Product
              </span>
              <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.4, margin: 0 }}>
                {createdLinkItem.country || '🇺🇸'} {createdLinkItem.name}
              </p>
            </div>

            {/* 1. Shareable Product Showcase Web Page Link */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.375rem' }}>
                1. Shareable Hosted Showcase Web Page
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={getFullUrl(createdLinkItem.showcaseUrl || `/p/${createdLinkItem.shortSlug}`)}
                  className="input-field"
                  style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#0891B2', fontWeight: 700 }}
                />
                <button
                  onClick={() => copyToClipboard(getFullUrl(createdLinkItem.showcaseUrl || `/p/${createdLinkItem.shortSlug}`), 'showcase')}
                  style={{ padding: '0.625rem 1rem', borderRadius: '10px', backgroundColor: '#06B6D4', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}
                >
                  <Copy size={16} />
                  <span>{copiedType === 'showcase' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 2. Direct Redirect Tracking Link */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.375rem' }}>
                2. Direct Amazon Referral Tracking Link
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={getFullUrl(createdLinkItem.shortUrl || `/r/${createdLinkItem.shortSlug}`)}
                  className="input-field"
                  style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
                <button
                  onClick={() => copyToClipboard(getFullUrl(createdLinkItem.shortUrl || `/r/${createdLinkItem.shortSlug}`), 'direct')}
                  style={{ padding: '0.625rem 1rem', borderRadius: '10px', backgroundColor: '#F1F5F9', color: '#334155', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}
                >
                  <Copy size={16} />
                  <span>{copiedType === 'direct' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Action Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Link
                href={createdLinkItem.showcaseUrl || `/p/${createdLinkItem.shortSlug}`}
                target="_blank"
                style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: '#ECFEFF',
                  color: '#0891B2',
                  border: '1px solid #CFFAFE',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem'
                }}
              >
                <Eye size={16} />
                <span>Preview Web Showcase</span>
              </Link>

              <button
                onClick={() => {
                  const text = encodeURIComponent(`Check out this Amazon product on LinkCraft: ${createdLinkItem.name}\n\n👉 View Page: ${getFullUrl(createdLinkItem.showcaseUrl || `/p/${createdLinkItem.shortSlug}`)}`);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                style={{
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
                  gap: '0.375rem'
                }}
              >
                <MessageCircle size={16} fill="#10B981" color="#ECFDF5" />
                <span>Share via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast message={toastMsg} />

      {/* Footer */}
      <footer style={{ marginTop: '3rem', padding: '1.5rem 0', textAlign: 'center', color: '#94A3B8', fontSize: '0.8125rem', borderTop: '1px solid #E2E8F0' }}>
        © 2026 LinkCraft Engine. All rights reserved.
      </footer>
    </div>
  );
}
