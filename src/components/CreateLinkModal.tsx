'use client';

import React, { useState } from 'react';
import { X, Link2, Sparkles, Check, Copy } from 'lucide-react';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export default function CreateLinkModal({ isOpen, onClose, showToast }: CreateLinkModalProps) {
  const [campaignName, setCampaignName] = useState('');
  const [destination, setDestination] = useState('/courses/web-development');
  const [customSlug, setCustomSlug] = useState('');
  const [utmSource, setUtmSource] = useState('youtube');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = customSlug || campaignName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'promo';
    const finalUrl = `https://linkcraft.dev/r/${slug}`;
    setGeneratedLink(finalUrl);
    showToast(`Created tracking link: ${finalUrl}`);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="ilearner-card animate-fade-in"
        style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative', borderRadius: '20px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.625rem', borderRadius: '12px', backgroundColor: '#ECFEFF' }}>
            <Link2 size={24} color="#06B6D4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Create Tracking Link</h3>
            <p style={{ fontSize: '0.8438rem', color: '#64748B' }}>
              Generate a custom Amazon affiliate short URL for your campaign
            </p>
          </div>
        </div>

        {!generatedLink ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Campaign Name / Identifier</label>
              <input
                type="text"
                required
                placeholder="e.g. YouTube Video - Tech Review"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Custom Slug (Optional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8438rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                  linkcraft.dev/r/
                </span>
                <input
                  type="text"
                  placeholder="yt-series"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="input-field"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
                Cancel
              </button>
              <button type="submit" className="btn-teal" style={{ flex: 1 }}>
                Generate Link
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>
                Your Tracking Link is Ready!
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'monospace', color: '#06B6D4' }}>
                {generatedLink}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  showToast('Copied to clipboard!');
                }}
                className="btn-teal"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Copy size={16} />
                Copy Link
              </button>
              <button
                onClick={() => {
                  setGeneratedLink(null);
                  onClose();
                }}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer', color: '#475569' }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
