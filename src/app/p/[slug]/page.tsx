'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, CheckCircle, ShieldCheck, Share2, Copy, MessageCircle, ExternalLink, ArrowLeft, Truck, Award } from 'lucide-react';
import Toast from '@/components/Toast';

interface ShowcasePageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductShowcasePage({ params }: ShowcasePageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/links`);
        const data = await res.json();
        if (data.success && data.links) {
          const found = data.links.find((l: any) => l.shortSlug.toLowerCase() === slug.toLowerCase() || l.asin?.toLowerCase() === slug.toLowerCase());
          if (found) {
            setProduct(found);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #4F46E5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#64748B', fontWeight: 600 }}>Loading LinkCraft Product Page...</p>
        </div>
      </div>
    );
  }

  // Product details
  const item = product || {
    name: 'Amazon Featured Showcase Product',
    price: '$29.99',
    originalPrice: '$39.99',
    rating: '4.8 ★',
    country: '🇺🇸',
    affiliateUrl: `https://www.amazon.com/dp/${slug}?tag=ilearner-20`,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    asin: slug.toUpperCase(),
    features: [
      'Genuine Amazon verified quality guaranteed product',
      'Eligible for Prime 2-Day Fast Free Shipping',
      'Over 1,000+ positive customer ratings & reviews',
      '30-day money back return policy via Amazon'
    ]
  };

  const directBuyUrl = item.affiliateUrl || item.destinationUrl || `https://www.amazon.com/dp/${item.asin || slug}?tag=linkcraft-20`;
  const shareableUrl = typeof window !== 'undefined' ? window.location.href : `https://linkcraft.dev/p/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    showToast('Showcase link copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this product on LinkCraft: ${item.name}\n\n👉 View & Buy here: ${shareableUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Schema.org JSON-LD Structured Data for Product SEO
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: item.name,
    image: [item.imageUrl],
    description: `Buy ${item.name} on Amazon via LinkCraft. Verified ratings, fast Prime delivery, and best prices.`,
    sku: item.asin || slug,
    mpn: item.asin || slug,
    brand: {
      "@type": "Brand",
      name: "Amazon Affiliate Choice"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1420"
    },
    offers: {
      "@type": "Offer",
      url: directBuyUrl,
      priceCurrency: "USD",
      price: item.price ? item.price.replace('$', '') : "29.99",
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Amazon"
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Dynamic SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Header Bar */}
      <header style={{ backgroundColor: '#0F172A', padding: '1rem 2rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/create" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem' }}>
          <ArrowLeft size={18} />
          <span>LinkCraft</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.375rem 0.875rem', borderRadius: '99px', fontSize: '0.8125rem', fontWeight: 600 }}>
          <ShieldCheck size={16} color="#10B981" />
          <span>Verified Amazon Affiliate Partner</span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', boxShadow: '0 10px 30px rgba(15,23,42,0.06)', border: '1px solid #E2E8F0', padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          
          {/* Left Column: Image & Media */}
          <div>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '380px' }}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
              />
              <span style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#0F172A', color: '#FFFFFF', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>{item.country || '🇺🇸'}</span> Amazon Marketplace
              </span>
              <span style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#7C3AED', color: '#FFFFFF', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800 }}>
                SAVE 20%
              </span>
            </div>

            {/* Badges Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                <Truck size={18} color="#4F46E5" />
                <span>Prime 2-Day Fast Delivery</span>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                <Award size={18} color="#10B981" />
                <span>Amazon Choice Verified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Buy CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.25rem 0.625rem', borderRadius: '99px', fontSize: '0.8125rem', fontWeight: 700 }}>
                  <Star size={14} fill="#D97706" />
                  <span>{item.rating || '4.8 ★'}</span>
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>(1,420 Customer Reviews)</span>
                <span style={{ fontSize: '0.8125rem', color: '#94A3B8', marginLeft: 'auto' }}>ASIN: {item.asin || 'B08X123456'}</span>
              </div>

              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3, marginBottom: '1rem' }}>
                {item.name}
              </h1>

              {/* Price Section */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#4F46E5' }}>
                  {item.price || '$24.99'}
                </span>
                {item.originalPrice && (
                  <span style={{ fontSize: '1.125rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                    {item.originalPrice}
                  </span>
                )}
                <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  In Stock & Ready to Ship
                </span>
              </div>

              {/* Features List */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                  Product Highlights
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, margin: 0, listStyle: 'none' }}>
                  {(item.features || [
                    'Premium quality material built for daily endurance',
                    'Compatible with standard Amazon Warranty & Returns',
                    'Direct Amazon Associates tracked referral item'
                  ]).map((feat: string, idx: number) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: '#334155', lineHeight: 1.4 }}>
                      <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Buttons */}
            <div>
              <a
                href={directBuyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.625rem',
                  width: '100%',
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  backgroundColor: '#4F46E5',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1.0625rem',
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
                  transition: 'transform 0.15s, background-color 0.15s',
                  marginBottom: '0.875rem'
                }}
              >
                <ShoppingBag size={20} />
                <span>View & Buy on Amazon</span>
                <ExternalLink size={18} />
              </a>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  onClick={handleWhatsAppShare}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    backgroundColor: '#ECFDF5',
                    color: '#10B981',
                    border: '1px solid #A7F3D0',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  <MessageCircle size={18} fill="#10B981" color="#ECFDF5" />
                  <span>Share via WhatsApp</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    backgroundColor: '#F1F5F9',
                    color: '#334155',
                    border: '1px solid #E2E8F0',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={18} />
                  <span>Copy Page Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure Notice Card */}
        <div style={{ marginTop: '2rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            <strong>Amazon Associates Disclosure:</strong> LinkCraft is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Product prices and availability are accurate as of the date/time indicated and are subject to change.
          </p>
        </div>
      </main>

      <Toast message={toastMsg} />
    </div>
  );
}
