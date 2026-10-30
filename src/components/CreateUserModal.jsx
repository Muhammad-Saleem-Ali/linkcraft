'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Lock, Eye, EyeOff, Percent, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function CreateUserModal({ isOpen, onClose, onCreateUser, showToast }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [commissionRate, setCommissionRate] = useState(70);
    const [status, setStatus] = useState('active');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setCommissionRate(70);
        setStatus('active');
        setShowPassword(false);
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Reset whenever modal opens
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const handleGeneratePassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
        let gen = '';
        for (let i = 0; i < 12; i++) {
            gen += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(gen);
        setShowPassword(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Please enter the partner\'s full name');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsSubmitting(true);
        try {
            await onCreateUser({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                commissionRate: Number(commissionRate) / 100,
                status,
            });
            showToast?.(`Partner ${name.trim()} created successfully!`);
            handleClose();
        } catch (err) {
            setError(err.message || 'Failed to create user account');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted || !isOpen) return null;

    const modalContent = (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
            }}
            onClick={handleClose}
        >
            <div
                className="ilearner-card animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '520px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    border: '1px solid #E2E8F0',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                backgroundColor: '#EEF2FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#4F46E5',
                            }}
                        >
                            <User size={22} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                Create New Partner Account
                            </h3>
                            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0.125rem 0 0 0' }}>
                                Provision credentials for a new affiliate partner
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: '0.375rem',
                            borderRadius: '8px',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FCA5A5',
                            color: '#DC2626',
                            fontSize: '0.8438rem',
                            fontWeight: 600,
                            marginBottom: '1.25rem',
                        }}
                    >
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                    {/* Full Name */}
                    <div>
                        <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.375rem' }}>
                            Full Name <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Sarah Jenkins"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                style={{
                                    borderRadius: '10px',
                                    fontSize: '0.875rem',
                                    paddingLeft: '2.5rem',
                                    width: '100%',
                                }}
                            />
                            <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div>
                        <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.375rem' }}>
                            Email Address <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                required
                                placeholder="sarah@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                style={{
                                    borderRadius: '10px',
                                    fontSize: '0.875rem',
                                    paddingLeft: '2.5rem',
                                    width: '100%',
                                }}
                            />
                            <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>
                    </div>

                    {/* Temporary Password */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                                Temporary Password <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleGeneratePassword}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#4F46E5',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                }}
                            >
                                <Sparkles size={12} />
                                <span>Generate Password</span>
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                style={{
                                    borderRadius: '10px',
                                    fontSize: '0.875rem',
                                    paddingLeft: '2.5rem',
                                    paddingRight: '2.5rem',
                                    width: '100%',
                                }}
                            />
                            <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748B',
                                    cursor: 'pointer',
                                }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '0.25rem' }}>
                            Share these login credentials with the partner so they can sign in.
                        </span>
                    </div>

                    {/* Split Row: Commission Rate & Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.375rem' }}>
                                Commission Rate (%)
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    step="1"
                                    value={commissionRate}
                                    onChange={(e) => setCommissionRate(e.target.value)}
                                    className="input-field"
                                    style={{
                                        borderRadius: '10px',
                                        fontSize: '0.875rem',
                                        paddingLeft: '2.5rem',
                                        width: '100%',
                                    }}
                                />
                                <Percent size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.375rem' }}>
                                Account Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="input-field"
                                style={{
                                    borderRadius: '10px',
                                    fontSize: '0.875rem',
                                    width: '100%',
                                    padding: '0.625rem 0.75rem',
                                }}
                            >
                                <option value="active">Active (Immediate Access)</option>
                                <option value="pending">Pending Approval</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '10px',
                                backgroundColor: '#F1F5F9',
                                border: '1px solid #E2E8F0',
                                color: '#475569',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-teal"
                            style={{
                                flex: 2,
                                padding: '0.75rem',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <div style={{ width: '16px', height: '16px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={16} />
                                    <span>Create User Account</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
