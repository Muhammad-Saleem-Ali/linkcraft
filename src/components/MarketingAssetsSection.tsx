'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Tag,
  Copy,
  Check,
  Download,
  FileText,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Share2
} from 'lucide-react';

interface MarketingAssetsSectionProps {
  showToast: (msg: string) => void;
}

export default function MarketingAssetsSection({ showToast }: MarketingAssetsSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const promoCodes = [
    {
      code: 'AMZ-SHOWCASE30',
      discount: '30% OFF',
      description: 'Applicable to any product showcase plan or associate tool.',
      usageCount: '184 redeemed',
    },
    {
      code: 'AMZ-SPECIAL20',
      discount: '20% OFF',
      description: 'Valid for monthly associate membership plans.',
      usageCount: '92 redeemed',
    },
  ];

  const banners = [
    {
      id: 1,
      title: 'Amazon Product Showcase Hub (1200x630)',
      category: 'Social Media / OpenGraph',
      dimensions: '1200 x 630 px',
      bgGradient: 'linear-gradient(135deg, #0F172A 0%, #06B6D4 100%)',
    },
    {
      id: 2,
      title: 'Affiliate Showcase Engine Banner',
      category: 'Display Web Banner',
      dimensions: '728 x 90 px',
      bgGradient: 'linear-gradient(135deg, #0F172A 0%, #0EA5E9 100%)',
    },
    {
      id: 3,
      title: 'LinkCraft Promo Story Card',
      category: 'Instagram / Mobile Story',
      dimensions: '1080 x 1920 px',
      bgGradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
    },
  ];

  const emailSwipes = [
    {
      title: 'High-Converting Newsletter Pitch (Amazon Showcase)',
      subject: '🚀 Check out featured Amazon deals via LinkCraft + 30% discount',
      body: `Hey [First Name],\n\nIf you've been looking to discover high-converting Amazon product deals with verified ratings and Prime delivery, I strongly recommend checking out LinkCraft.\n\nCheck out my showcase page:\nhttps://linkcraft.dev/r/ahmar (Code: LINKCRAFT-30)\n\nHappy shopping!`,
    },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    showToast(`Copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem', color: '#0F172A' }}>
          Marketing Assets & Promo Tools
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
          High-converting banners, exclusive partner coupon codes, and email copy swipes
        </p>
      </div>

      {/* Exclusive Promo Codes Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#ECFEFF' }}>
            <Tag size={20} color="#06B6D4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0F172A' }}>Your Dedicated Partner Promo Codes</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Give your audience an exclusive discount while tracking sales back to your account
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {promoCodes.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'monospace', color: '#06B6D4' }}>
                    {item.code}
                  </span>
                  <span style={{ backgroundColor: '#ECFEFF', color: '#0891B2', padding: '0.25rem 0.625rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {item.discount}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.4, marginBottom: '1rem' }}>
                  {item.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{item.usageCount}</span>
                <button
                  onClick={() => handleCopy(item.code, `code-${idx}`)}
                  style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: '8px',
                    backgroundColor: '#06B6D4',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}
                >
                  {copiedCode === `code-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode === `code-${idx}` ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banners Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#ECFEFF' }}>
            <ImageIcon size={20} color="#06B6D4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0F172A' }}>Official Banner Graphics & Display Ads</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Embed ready-made graphic banners on your website, blog, or social channels
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {banners.map((banner) => (
            <div
              key={banner.id}
              style={{
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  height: '140px',
                  background: banner.bgGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  textAlign: 'center',
                  color: '#FFFFFF',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>{banner.title}</div>
              </div>

              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 700, textTransform: 'uppercase' }}>
                    {banner.category}
                  </span>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginTop: '0.125rem' }}>
                    {banner.dimensions}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => showToast(`Downloaded ${banner.title}`)}
                    className="btn-teal"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
                  >
                    <Download size={14} />
                    Download PNG
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
