'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Sparkles, X, Copy, Check, Eye, MessageCircle, ExternalLink } from 'lucide-react';

export default function ShowcaseCreatedModal({ isOpen, onClose, link, showToast }) {
    const [mounted, setMounted] = useState(false);
    const [copiedType, setCopiedType] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    if (!mounted || !isOpen || !link) return null;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';

    const getFullUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
    };

    const showcaseUrl = getFullUrl(link.showcaseUrl || `/p/${link.shortSlug || link.id}`);
    const trackingUrl = getFullUrl(link.shortUrl || `/r/${link.shortSlug || link.id}`);
    const directAmazonUrl = link.affiliateUrl || link.destinationUrl || '';

    const handleCopy = (text, type, label) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedType(type);
        if (showToast) {
            showToast(`Copied ${label} to clipboard!`);
        }
        setTimeout(() => setCopiedType(null), 2200);
    };

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(
            `Check out this product on LinkCraft: ${link.name || 'Amazon Product'}\n\n👉 View & Buy here: ${showcaseUrl}`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const modalContent = (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '1rem',
                boxSizing: 'border-box',
            }}
            onClick={onClose}
        >
            <div
                className="ilearner-card animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '560px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '2rem',
                    position: 'relative',
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
                    border: '1px solid #E2E8F0',
                    boxSizing: 'border-box',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    style={{
                        position: 'absolute',
                        right: '1.25rem',
                        top: '1.25rem',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#F1F5F9',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E2E8F0';
                        e.currentTarget.style.color = '#0F172A';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F1F5F9';
                        e.currentTarget.style.color = '#64748B';
                    }}
                >
                    <X size={18} />
                </button>

                {/* Header with Sparkles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                    <div
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '14px',
                            backgroundColor: '#ECFEFF',
                            border: '1px solid #CFFAFE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Sparkles size={24} color="#06B6D4" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                            Showcase Web Page Created!
                        </h3>
                        <p style={{ fontSize: '0.8438rem', color: '#64748B', margin: '0.25rem 0 0', fontWeight: 500 }}>
                            Your Amazon Associate attribution page is live and ready to share.
                        </p>
                    </div>
                </div>

                {/* Product Summary Preview */}
                <div
                    style={{
                        padding: '0.875rem 1rem',
                        borderRadius: '14px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        marginBottom: '1.25rem',
                    }}
                >
                    <span
                        style={{
                            fontSize: '0.725rem',
                            fontWeight: 800,
                            color: '#06B6D4',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '0.25rem',
                        }}
                    >
                        Amazon Product
                    </span>
                    <p
                        style={{
                            fontSize: '0.9375rem',
                            fontWeight: 700,
                            color: '#0F172A',
                            lineHeight: 1.4,
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {link.country || '🇺🇸'} {link.name || 'Amazon Product'}
                    </p>
                </div>

                {/* 1. Shareable Hosted Showcase Web Page */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.375rem' }}>
                        1. Shareable Hosted Showcase Web Page
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            readOnly
                            value={showcaseUrl}
                            className="input-field"
                            style={{
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                color: '#0891B2',
                                fontWeight: 700,
                                backgroundColor: '#F0FDFA',
                                borderColor: '#CCFBF1',
                                borderRadius: '10px',
                                padding: '0.625rem 0.875rem',
                                flex: 1,
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => handleCopy(showcaseUrl, 'showcase', 'Showcase URL')}
                            style={{
                                padding: '0.625rem 1.125rem',
                                borderRadius: '10px',
                                backgroundColor: copiedType === 'showcase' ? '#10B981' : '#06B6D4',
                                color: '#FFFFFF',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                flexShrink: 0,
                                minWidth: '85px',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                        >
                            {copiedType === 'showcase' ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
                            <span>{copiedType === 'showcase' ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

                {/* 2. Direct Amazon Referral Tracking Link */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.375rem' }}>
                        2. Direct Amazon Referral Tracking Link
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            readOnly
                            value={trackingUrl}
                            className="input-field"
                            style={{
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                color: '#1E293B',
                                fontWeight: 600,
                                backgroundColor: '#F8FAFC',
                                borderColor: '#E2E8F0',
                                borderRadius: '10px',
                                padding: '0.625rem 0.875rem',
                                flex: 1,
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => handleCopy(trackingUrl, 'tracking', 'Tracking URL')}
                            style={{
                                padding: '0.625rem 1.125rem',
                                borderRadius: '10px',
                                backgroundColor: copiedType === 'tracking' ? '#10B981' : '#0F172A',
                                color: '#FFFFFF',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                flexShrink: 0,
                                minWidth: '85px',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                        >
                            {copiedType === 'tracking' ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
                            <span>{copiedType === 'tracking' ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

                {/* 3. Direct Amazon URL (with Partner Attribution) */}
                {directAmazonUrl && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                                3. Direct Amazon URL (with Your Partner Attribution)
                            </label>
                            <span
                                style={{
                                    fontSize: '0.6875rem',
                                    color: '#10B981',
                                    fontWeight: 700,
                                    backgroundColor: '#ECFDF5',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #A7F3D0',
                                }}
                            >
                                Amazon Canonical
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                readOnly
                                value={directAmazonUrl}
                                className="input-field"
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.8125rem',
                                    color: '#B45309',
                                    backgroundColor: '#FFFBEB',
                                    borderColor: '#FDE68A',
                                    borderRadius: '10px',
                                    padding: '0.625rem 0.875rem',
                                    flex: 1,
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => handleCopy(directAmazonUrl, 'amazon_direct', 'Direct Amazon link')}
                                style={{
                                    padding: '0.625rem 1.125rem',
                                    borderRadius: '10px',
                                    backgroundColor: copiedType === 'amazon_direct' ? '#10B981' : '#FEF3C7',
                                    color: copiedType === 'amazon_direct' ? '#FFFFFF' : '#B45309',
                                    border: '1px solid #FDE68A',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    flexShrink: 0,
                                    minWidth: '85px',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {copiedType === 'amazon_direct' ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
                                <span>{copiedType === 'amazon_direct' ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Bottom Action Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Link
                        href={showcaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            backgroundColor: '#06B6D4',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Eye size={18} />
                        <span>Preview Web Showcase</span>
                        <ExternalLink size={14} style={{ opacity: 0.8 }} />
                    </Link>

                    <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        style={{
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            backgroundColor: '#25D366',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <MessageCircle size={18} fill="#FFFFFF" color="#25D366" />
                        <span>Share via WhatsApp</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
