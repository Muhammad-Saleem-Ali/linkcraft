'use client';

import React, { useState } from 'react';
import {
  Link2,
  Copy,
  Plus,
  QrCode,
  ExternalLink,
  Search,
  Check,
  TrendingUp,
  Sparkles,
  BarChart2,
  Shield,
  Trash2
} from 'lucide-react';

interface LinksSectionProps {
  showToast: (msg: string) => void;
  onOpenCreateLinkModal: () => void;
}

export default function LinksSection({ showToast, onOpenCreateLinkModal }: LinksSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedQrLink, setSelectedQrLink] = useState<{ title: string; url: string } | null>(null);

  // Active tracking links initial state
  const [links, setLinks] = useState([
    {
      id: 'lnk-01',
      name: 'YouTube Tech Review - Web Dev Bootcamp',
      url: 'https://ilearner.dev/r/yt-webdev',
      destination: '/courses/web-development',
      utmSource: 'youtube',
      utmCampaign: 'summer_review',
      clicks: 14280,
      conversions: 412,
      revenue: '$4,120.00',
      createdDate: 'Aug 10, 2026',
    },
    {
      id: 'lnk-02',
      name: 'Twitter/X AI & LLM Masterclass Thread',
      url: 'https://ilearner.dev/r/x-ai-mastery',
      destination: '/courses/ai-engineering',
      utmSource: 'twitter',
      utmCampaign: 'ai_launch',
      clicks: 9410,
      conversions: 289,
      revenue: '$3,468.00',
      createdDate: 'Aug 24, 2026',
    },
    {
      id: 'lnk-03',
      name: 'Newsletter Sponsor Link #42',
      url: 'https://ilearner.dev/r/nl-issue42',
      destination: '/pricing/all-access',
      utmSource: 'substack',
      utmCampaign: 'newsletter_sep',
      clicks: 6850,
      conversions: 184,
      revenue: '$2,760.00',
      createdDate: 'Sep 01, 2026',
    },
    {
      id: 'lnk-04',
      name: 'Personal Dev Blog Sidebar Banner',
      url: 'https://ilearner.dev/r/blog-sidebar',
      destination: '/',
      utmSource: 'dev_to',
      utmCampaign: 'sticky_banner',
      clicks: 3410,
      conversions: 92,
      revenue: '$920.00',
      createdDate: 'Sep 08, 2026',
    },
  ]);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast(`Copied tracking link: ${url}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Affiliate Links & Campaign Tracking
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--brand-text-muted)' }}>
            Create shortened tracking links, monitor conversion performance, and export QR codes
          </p>
        </div>

        <button onClick={onOpenCreateLinkModal} className="btn btn-primary">
          <Plus size={18} />
          Create New Tracking Link
        </button>
      </div>

      {/* Primary Default Partner Link Banner */}
      <div
        className="card glass-card"
        style={{
          padding: '1.5rem',
          borderLeft: '4px solid var(--brand-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--brand-accent-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link2 size={24} color="var(--brand-accent)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Your Global Default Referral Link</span>
              <span className="badge badge-success">Active</span>
            </div>
            <span
              style={{
                fontSize: '0.9375rem',
                fontFamily: 'monospace',
                fontWeight: 600,
                color: 'var(--brand-accent)',
              }}
            >
              https://ilearner.dev/r/janedoe
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button
            onClick={() => handleCopyLink('https://ilearner.dev/r/janedoe', 'global')}
            className="btn btn-primary btn-sm"
          >
            {copiedId === 'global' ? <Check size={16} /> : <Copy size={16} />}
            {copiedId === 'global' ? 'Copied!' : 'Copy Global Link'}
          </button>
          <button
            onClick={() => setSelectedQrLink({ title: 'Global Referral Link', url: 'https://ilearner.dev/r/janedoe' })}
            className="btn btn-secondary btn-sm"
          >
            <QrCode size={16} />
            QR Code
          </button>
        </div>
      </div>

      {/* Links List Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--brand-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>Active Campaign Tracking Links ({links.length})</h3>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="var(--brand-text-subtle)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Filter links..."
              className="input-field"
              style={{ paddingLeft: '2.25rem', padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--brand-bg)', borderBottom: '1px solid var(--brand-border)', color: 'var(--brand-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.875rem 1.5rem' }}>Campaign Name & Short URL</th>
                <th style={{ padding: '0.875rem 1rem' }}>Destination</th>
                <th style={{ padding: '0.875rem 1rem' }}>Clicks</th>
                <th style={{ padding: '0.875rem 1rem' }}>Conversions</th>
                <th style={{ padding: '0.875rem 1rem' }}>Revenue Earned</th>
                <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id} style={{ borderBottom: '1px solid var(--brand-border-subtle)', transition: 'background-color 0.15s' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.25rem' }}>
                      {link.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--brand-accent)' }}>
                      <span>{link.url}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1rem', color: 'var(--brand-text-muted)', fontSize: '0.8125rem' }}>
                    <code>{link.destination}</code>
                  </td>
                  <td style={{ padding: '1rem 1rem', fontWeight: 600 }}>
                    {link.clicks.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem 1rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-text)' }}>{link.conversions}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--brand-text-subtle)', marginLeft: '0.25rem' }}>
                      ({((link.conversions / link.clicks) * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1rem', fontWeight: 700, color: 'var(--brand-success)' }}>
                    {link.revenue}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                      <button
                        onClick={() => handleCopyLink(link.url, link.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.375rem', borderRadius: '8px' }}
                        title="Copy Link"
                      >
                        {copiedId === link.id ? <Check size={16} color="var(--brand-success)" /> : <Copy size={16} />}
                      </button>
                      <button
                        onClick={() => setSelectedQrLink({ title: link.name, url: link.url })}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.375rem', borderRadius: '8px' }}
                        title="Show QR Code"
                      >
                        <QrCode size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Popup Modal */}
      {selectedQrLink && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 19, 43, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem',
          }}
          onClick={() => setSelectedQrLink(null)}
        >
          <div
            className="card animate-fade-in"
            style={{ width: '100%', maxWidth: '380px', padding: '1.75rem', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.375rem' }}>
              QR Code Asset
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--brand-text-muted)', marginBottom: '1.25rem' }}>
              {selectedQrLink.title}
            </p>

            {/* Generated QR Code preview box */}
            <div
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 1.25rem',
                border: '2px solid var(--brand-border)',
                borderRadius: '16px',
                padding: '1rem',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Dummy SVG QR pattern */}
              <svg width="160" height="160" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#FFFFFF" />
                <path d="M 10 10 H 35 V 35 H 10 Z M 15 15 V 30 H 30 V 15 Z" fill="#0B132B" />
                <path d="M 65 10 H 90 V 35 H 65 Z M 70 15 V 30 H 85 V 15 Z" fill="#0B132B" />
                <path d="M 10 65 H 35 V 90 H 10 Z M 15 70 V 85 H 30 V 70 Z" fill="#0B132B" />
                <rect x="45" y="15" width="10" height="10" fill="#4F6BFF" />
                <rect x="45" y="35" width="20" height="10" fill="#0B132B" />
                <rect x="15" y="45" width="10" height="10" fill="#0B132B" />
                <rect x="65" y="45" width="25" height="10" fill="#0B132B" />
                <rect x="45" y="65" width="10" height="25" fill="#4F6BFF" />
                <rect x="65" y="65" width="20" height="20" fill="#0B132B" />
              </svg>
            </div>

            <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--brand-text-subtle)', marginBottom: '1.25rem' }}>
              {selectedQrLink.url}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  showToast('Downloaded High-Res PNG QR Code');
                  setSelectedQrLink(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Download PNG
              </button>
              <button
                onClick={() => setSelectedQrLink(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
