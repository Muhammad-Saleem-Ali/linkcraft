'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Sparkles, Globe, ArrowLeft, ExternalLink, Star, Filter, Share2, Check } from 'lucide-react';
import Toast from '@/components/Toast';

interface PublicStorePageProps {
  params: Promise<{ username: string }>;
}

export default function PublicStorePage({ params }: PublicStorePageProps) {
  const { username } = use(params);
  const [activeDateFilter, setActiveDateFilter] = useState<'today' | 'yesterday' | 'week'>('yesterday');
  const [selectedCountry, setSelectedCountry] = useState('All countries');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const displayName = username.toLowerCase() === 'hka' ? 'Ahmar' : username.charAt(0).toUpperCase() + username.slice(1);

  // Products curated for the user's public store
  const allProducts = [
    {
      id: 'p-1',
      title: 'ORGVIVA Eye Cream with 360 Cooling Roller',
      slug: 'b08x123456',
      price: '$18.99',
      rating: '5.0',
      category: 'Creams',
      country: '🇺🇸 US',
      filterGroup: 'yesterday',
      imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-2',
      title: 'Soft Cervical Collar for Neck Support',
      slug: 'b08y987654',
      price: '$24.50',
      rating: '5.0',
      category: 'Traction Equipment',
      country: '🇺🇸 US',
      filterGroup: 'yesterday',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-3',
      title: 'Disposable Hand Warmers - Up to 15 Hours Heat (10 Pack)',
      slug: 'b07z111222',
      price: '$14.99',
      rating: '4.4',
      category: 'Hand Warmers',
      country: '🇺🇸 US',
      filterGroup: 'yesterday',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-4',
      title: 'Men Women Custom Cotton T Shirts Personalized Print & Comfort Fit',
      slug: 'b08x123456',
      price: '$19.99',
      rating: '4.9',
      category: 'Apparel',
      country: '🇺🇸 US',
      filterGroup: 'today',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-5',
      title: 'YASHINE Car Wash Foam Gun Kit for Garden Hose',
      slug: 'b08y987654',
      price: '$32.99',
      rating: '4.8',
      category: 'Automotive Care',
      country: '🇺🇸 US',
      filterGroup: 'today',
      imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-6',
      title: 'JSELF 3 Inch Gel Memory Foam Mattress Topper',
      slug: 'b07z111222',
      price: '$79.99',
      rating: '4.7',
      category: 'Home & Bedding',
      country: '🇺🇸 US',
      filterGroup: 'week',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const filteredProducts = allProducts.filter((p) => {
    if (activeDateFilter && p.filterGroup !== activeDateFilter && activeDateFilter !== 'week') {
      return false;
    }
    if (selectedCountry !== 'All countries' && !p.country.includes(selectedCountry.slice(0, 2))) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      {/* Header Bar */}
      <header
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                navigator.clipboard.writeText(window.location.href);
                showToast('Public store page link copied!');
              }
            }}
            className="btn-secondary btn-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Share2 size={14} />
            <span>Share Store</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        
        {/* Store Title Section */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: '#06B6D4', textTransform: 'uppercase' }}>
            /U/{username.toUpperCase()}
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '0.25rem' }}>
            Shop by {displayName}
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#64748B', marginTop: '0.375rem' }}>
            Hand-picked Amazon products, refreshed as they come in.
          </p>
        </div>

        {/* Filter Toolbar Card (Matching Screenshot 4) */}
        <div
          className="ilearner-card"
          style={{
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Date Filter Preset Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveDateFilter('today')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '99px',
                border: 'none',
                backgroundColor: activeDateFilter === 'today' ? '#06B6D4' : '#F1F5F9',
                color: activeDateFilter === 'today' ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Today
            </button>
            <button
              onClick={() => setActiveDateFilter('yesterday')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '99px',
                border: 'none',
                backgroundColor: activeDateFilter === 'yesterday' ? '#06B6D4' : '#F1F5F9',
                color: activeDateFilter === 'yesterday' ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Yesterday
            </button>
            <button
              onClick={() => setActiveDateFilter('week')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '99px',
                border: 'none',
                backgroundColor: activeDateFilter === 'week' ? '#06B6D4' : '#F1F5F9',
                color: activeDateFilter === 'week' ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              This Week
            </button>
          </div>

          {/* Country Filter Selector */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0F172A',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option>All countries</option>
            <option>United States 🇺🇸</option>
            <option>United Kingdom 🇬🇧</option>
          </select>
        </div>

        {/* Product Cards Grid (Matching Screenshot 4) */}
        <div
          className="responsive-grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="ilearner-card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '20px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div>
                {/* Product Image Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    borderRadius: '14px',
                    backgroundColor: '#F8FAFC',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.625rem',
                      borderRadius: '99px',
                    }}
                  >
                    {product.price}
                  </span>
                </div>

                {/* Product Title */}
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.35,
                    marginBottom: '0.625rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.title}
                </h3>

                {/* Meta row: Country, Rating & Category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748B', marginBottom: '1.25rem' }}>
                  <span>{product.country}</span>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', color: '#F59E0B', fontWeight: 700 }}>
                    <Star size={13} fill="#F59E0B" />
                    <span>{product.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{product.category}</span>
                </div>
              </div>

              {/* Action Button pointing to Product Showcase page */}
              <Link
                href={`/p/${product.slug}`}
                className="btn-teal"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                }}
              >
                <span>View product</span>
                <ExternalLink size={15} />
              </Link>
            </div>
          ))}
        </div>
      </main>

      {/* Toast */}
      <Toast message={toastMsg} />
    </div>
  );
}
