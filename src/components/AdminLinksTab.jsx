'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, ExternalLink } from 'lucide-react';
export default function AdminLinksTab({ links, showToast }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [countryFilter, setCountryFilter] = useState('All countries');
    const filteredLinks = links.filter((l) => {
        if (countryFilter !== 'All countries' && !l.country.includes(countryFilter.slice(0, 2))) {
            return false;
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (l.name.toLowerCase().includes(q) ||
                (l.asin && l.asin.toLowerCase().includes(q)) ||
                (l.partnerName && l.partnerName.toLowerCase().includes(q)) ||
                l.shortSlug.toLowerCase().includes(q));
        }
        return true;
    });
    return (<div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
            Global Affiliate Links Audit
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
            Inspect every product showcase page and redirect link generated on the platform.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="input-field" style={{ width: 'auto', padding: '0.5rem 0.875rem', fontSize: '0.8125rem', borderRadius: '10px' }}>
            <option>All countries</option>
            <option>United States 🇺🇸</option>
            <option>United Kingdom 🇬🇧</option>
          </select>
        </div>
      </div>

      {/* Links Table Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '360px', marginBottom: '1.25rem' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}/>
          <input type="text" placeholder="Search by product, ASIN, partner..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field" style={{ paddingLeft: '2.375rem', padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}/>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Product Item</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Partner</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Views</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Clicks</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>
                      No affiliate tracking links found
                    </div>
                    <div style={{ fontSize: '0.8125rem' }}>
                      Affiliate tracking links created across the network will appear here for audit.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (<tr key={link.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  
                  {/* Product Details */}
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {link.imageUrl ? (<img src={link.imageUrl} alt="" style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }}/>) : (<div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#06B6D4' }}>
                          {link.country || '🇺🇸'}
                        </div>)}
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {link.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748B', marginTop: '0.125rem' }}>
                          <span>{link.country}</span>
                          <span>•</span>
                          <span style={{ fontFamily: 'monospace' }}>ASIN: {link.asin || link.shortSlug.toUpperCase()}</span>
                          <span>•</span>
                          <span>{link.price || '$24.99'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Partner */}
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{link.partnerName || 'Partner'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{link.partnerId}</div>
                  </td>

                  {/* Views */}
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center', fontWeight: 600 }}>
                    {link.views}
                  </td>

                  {/* Clicks */}
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center', fontWeight: 800, color: '#06B6D4' }}>
                    {link.clicks}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                    <span style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '99px',
                backgroundColor: link.status === 'active' ? '#ECFDF5' : '#FEF2F2',
                color: link.status === 'active' ? '#047857' : '#DC2626',
                fontSize: '0.725rem',
                fontWeight: 700,
            }}>
                      {link.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Link href={`/p/${link.shortSlug}`} target="_blank" style={{
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
                gap: '0.25rem',
            }}>
                        <Eye size={13}/>
                        <span>Showcase</span>
                      </Link>

                      <a href={link.affiliateUrl || link.destinationUrl} target="_blank" rel="noreferrer" style={{
                padding: '0.3125rem 0.625rem',
                borderRadius: '8px',
                backgroundColor: '#F1F5F9',
                color: '#334155',
                border: '1px solid #E2E8F0',
                fontWeight: 700,
                fontSize: '0.75rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
            }}>
                        <span>Amazon</span>
                        <ExternalLink size={12}/>
                      </a>
                    </div>
                  </td>
                </tr>)))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
