'use client';
import React, { useState, useEffect } from 'react';
import { Link2, Copy, Plus, QrCode, ExternalLink, Search, Check, RefreshCw } from 'lucide-react';
import { authFetch, getCurrentUser } from '@/utils/auth';
export default function LinksSection({ showToast, onOpenCreateLinkModal }) {
    const [links, setLinks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);
    const [selectedQrLink, setSelectedQrLink] = useState(null);
    const currentUser = getCurrentUser();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const storeIdentifier = currentUser?.storeSlug || currentUser?.id || 'store';
    const globalStoreUrl = `${origin}/u/${storeIdentifier}`;
    const fetchLinks = async () => {
        setIsLoading(true);
        try {
            const res = await authFetch('/api/links');
            const data = await res.json();
            if (data.success && data.links) {
                setLinks(data.links);
            }
        }
        catch (err) {
            console.error('Error fetching affiliate links:', err);
            showToast('Could not fetch links from server');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchLinks();
    }, []);
    const handleCopyLink = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        showToast(`Copied tracking link: ${url}`);
        setTimeout(() => setCopiedId(null), 2000);
    };
    const filteredLinks = links.filter((l) => {
        const q = searchQuery.toLowerCase();
        return (l.name.toLowerCase().includes(q) ||
            (l.asin && l.asin.toLowerCase().includes(q)) ||
            l.shortSlug.toLowerCase().includes(q));
    });
    return (<div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem', color: '#0F172A' }}>
            Affiliate Links & Campaign Tracking
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--brand-text-muted)' }}>
            Monitor real-time clicks, conversions, and export QR codes for your Amazon campaigns
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={fetchLinks} className="btn btn-secondary" style={{ padding: '0.625rem' }} title="Refresh links">
            <RefreshCw size={16}/>
          </button>
          <button onClick={onOpenCreateLinkModal} className="btn btn-primary">
            <Plus size={18}/>
            Create New Tracking Link
          </button>
        </div>
      </div>

      {/* Primary Default Partner Storefront Link Banner */}
      <div className="card glass-card" style={{
            padding: '1.5rem',
            borderLeft: '4px solid var(--brand-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--brand-accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Link2 size={24} color="var(--brand-accent)"/>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Your Global Affiliate Storefront</span>
              <span className="badge badge-success">Active</span>
            </div>
            <a
              href={globalStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.9375rem',
                fontFamily: 'monospace',
                fontWeight: 600,
                color: 'var(--brand-accent)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
              title="Open storefront in new tab"
            >
              <span>{globalStoreUrl}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <a
            href={globalStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none' }}
            title="Open storefront in new tab"
          >
            <ExternalLink size={16} />
            <span>Open</span>
          </a>
          <button onClick={() => handleCopyLink(globalStoreUrl, 'global')} className="btn btn-primary btn-sm">
            {copiedId === 'global' ? <Check size={16}/> : <Copy size={16}/>}
            {copiedId === 'global' ? 'Copied!' : 'Copy Storefront Link'}
          </button>
          <button onClick={() => setSelectedQrLink({ title: 'Global Affiliate Storefront', url: globalStoreUrl })} className="btn btn-secondary btn-sm">
            <QrCode size={16}/>
            QR Code
          </button>
        </div>
      </div>

      {/* Links List Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--brand-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
        }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>
            Active Campaign Tracking Links ({filteredLinks.length})
          </h3>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="var(--brand-text-subtle)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}/>
            <input type="text" placeholder="Filter links by name or ASIN..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field" style={{ paddingLeft: '2.25rem', padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}/>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {isLoading ? (<div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              Loading tracking links from database...
            </div>) : filteredLinks.length === 0 ? (<div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              No tracking links found. Click <strong>Create New Tracking Link</strong> above to generate your first link!
            </div>) : (<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--brand-bg)', borderBottom: '1px solid var(--brand-border)', color: 'var(--brand-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.875rem 1.5rem' }}>Product / Campaign</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Destination</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Views</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Clicks</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Est. Commission</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link) => {
                const linkUrl = `${origin}/r/${link.shortSlug}`;
                const estEarnings = (link.clicks * 42.5).toFixed(0);
                return (<tr key={link.id} style={{ borderBottom: '1px solid var(--brand-border-subtle)', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontWeight: 700,
                            color: 'var(--brand-text)',
                            marginBottom: '0.25rem',
                            display: 'block',
                            textDecoration: 'none',
                          }}
                          title="Open tracking link in new tab"
                        >
                          {link.name}
                        </a>
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            fontFamily: 'monospace',
                            fontSize: '0.8125rem',
                            color: 'var(--brand-accent)',
                            textDecoration: 'none',
                          }}
                          title="Open tracking link in new tab"
                        >
                          <span>{linkUrl}</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                      <td style={{ padding: '1rem 1rem', color: 'var(--brand-text-muted)', fontSize: '0.8125rem', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <a href={link.destinationUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.destinationUrl}</span>
                          <ExternalLink size={12}/>
                        </a>
                      </td>
                      <td style={{ padding: '1rem 1rem', fontWeight: 600 }}>
                        {link.views || 0}
                      </td>
                      <td style={{ padding: '1rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                        {link.clicks || 0}
                      </td>
                      <td style={{ padding: '1rem 1rem', fontWeight: 700, color: 'var(--brand-success)' }}>
                        Rs. {parseInt(estEarnings).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.375rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }} title="Open Tracking Link in New Tab">
                            <ExternalLink size={16} color="var(--brand-accent)" />
                          </a>
                          <button onClick={() => handleCopyLink(linkUrl, link.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.375rem', borderRadius: '8px' }} title="Copy Link">
                            {copiedId === link.id ? <Check size={16} color="var(--brand-success)"/> : <Copy size={16}/>}
                          </button>
                          <button onClick={() => setSelectedQrLink({ title: link.name, url: linkUrl })} className="btn btn-secondary btn-sm" style={{ padding: '0.375rem', borderRadius: '8px' }} title="Show QR Code">
                            <QrCode size={16}/>
                          </button>
                          <a href={`/p/${link.shortSlug}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.375rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }} title="View Showcase Page">
                            <ExternalLink size={16}/>
                          </a>
                        </div>
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>)}
        </div>
      </div>

      {/* QR Code Popup Modal with real dynamic QR code generation */}
      {selectedQrLink && (<div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(11, 19, 43, 0.7)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999,
                padding: '1rem',
            }} onClick={() => setSelectedQrLink(null)}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '380px', padding: '1.75rem', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.375rem' }}>
              QR Code Asset
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--brand-text-muted)', marginBottom: '1.25rem' }}>
              {selectedQrLink.title}
            </p>

            {/* Generated QR Code preview box with live QR image */}
            <div style={{
                width: '210px',
                height: '210px',
                margin: '0 auto 1.25rem',
                border: '2px solid var(--brand-border)',
                borderRadius: '16px',
                padding: '0.5rem',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedQrLink.url)}`} alt="Affiliate QR Code" width={190} height={190} style={{ borderRadius: '8px' }}/>
            </div>

            <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--brand-text-subtle)', marginBottom: '1.25rem', wordBreak: 'break-all' }}>
              {selectedQrLink.url}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => {
                window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(selectedQrLink.url)}`, '_blank');
                showToast('Opened High-Res PNG in new tab');
            }} className="btn btn-primary" style={{ flex: 1 }}>
                Open High-Res
              </button>
              <button onClick={() => setSelectedQrLink(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
