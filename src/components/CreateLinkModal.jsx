'use client';
import React, { useState } from 'react';
import { X, Link2, Copy, ExternalLink } from 'lucide-react';
import { authFetch } from '@/utils/auth';
export default function CreateLinkModal({ isOpen, onClose, showToast }) {
    const [amazonUrl, setAmazonUrl] = useState('');
    const [campaignName, setCampaignName] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedLink, setGeneratedLink] = useState(null);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amazonUrl.trim() || isSubmitting)
            return;
        setIsSubmitting(true);
        try {
            const res = await authFetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destinationUrl: amazonUrl.trim(),
                    name: campaignName.trim() || undefined,
                    customSlug: customSlug.trim() || undefined,
                }),
            });
            const data = await res.json();
            if (data.success && data.link) {
                const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
                const finalUrl = `${origin}/r/${data.link.shortSlug}`;
                setGeneratedLink(finalUrl);
                showToast(`Created tracking link for: ${data.link.name}!`);
            }
            else {
                showToast(data.error || 'Failed to generate link');
            }
        }
        catch {
            showToast('Error connecting to link generator API');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleResetAndClose = () => {
        setAmazonUrl('');
        setCampaignName('');
        setCustomSlug('');
        setGeneratedLink(null);
        onClose();
    };
    return (<div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
        }} onClick={handleResetAndClose}>
      <div className="ilearner-card animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '2rem', position: 'relative', borderRadius: '20px' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleResetAndClose} style={{
            position: 'absolute',
            right: '1.25rem',
            top: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
        }}>
          <X size={20}/>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.625rem', borderRadius: '12px', backgroundColor: '#ECFEFF' }}>
            <Link2 size={24} color="#06B6D4"/>
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Create Tracking Link</h3>
            <p style={{ fontSize: '0.8438rem', color: '#64748B' }}>
              Generate a tracked Amazon Associate short link and showcase page
            </p>
          </div>
        </div>

        {!generatedLink ? (<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 700, color: '#334155' }}>
                Amazon Product URL or ASIN <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input type="text" required placeholder="https://www.amazon.com/dp/B08X123456 or B08X123456" value={amazonUrl} onChange={(e) => setAmazonUrl(e.target.value)} className="input-field"/>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>
                Campaign Name / Identifier (Optional)
              </label>
              <input type="text" placeholder="e.g. YouTube Tech Review or Spring Deals" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="input-field"/>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>
                Custom Slug (Optional)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8438rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                  /r/
                </span>
                <input type="text" placeholder="spring-deals" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} className="input-field" style={{ fontFamily: 'monospace' }}/>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button type="button" onClick={handleResetAndClose} style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                fontWeight: 700,
                cursor: 'pointer',
                color: '#475569',
            }}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-teal" style={{ flex: 1 }}>
                {isSubmitting ? 'Generating...' : 'Generate Link'}
              </button>
            </div>
          </form>) : (<div style={{ textAlign: 'center' }}>
            <div style={{
                padding: '1.25rem',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Your Tracking Link is Live! (Click link to test)
              </span>
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: '#0891B2',
                  wordBreak: 'break-all',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  justifyContent: 'center',
                }}
                title="Click to open link in new tab"
              >
                <span>{generatedLink}</span>
                <ExternalLink size={15} style={{ flexShrink: 0 }} />
              </a>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => {
                navigator.clipboard.writeText(generatedLink);
                showToast('Copied to clipboard!');
            }} className="btn-teal" style={{ flex: 1, minWidth: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Copy size={16}/>
                Copy Link
              </button>
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  minWidth: '130px',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#ECFEFF',
                  color: '#0891B2',
                  border: '1px solid #CFFAFE',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  cursor: 'pointer',
                }}
                title="Open in new tab"
              >
                <ExternalLink size={16} />
                <span>Open in Tab</span>
              </a>
              <button onClick={handleResetAndClose} style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                fontWeight: 700,
                cursor: 'pointer',
                color: '#475569',
            }}>
                Done
              </button>
            </div>
          </div>)}
      </div>
    </div>);
}
