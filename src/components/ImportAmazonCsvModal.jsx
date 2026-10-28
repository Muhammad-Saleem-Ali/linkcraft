'use client';
import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { authFetch } from '@/utils/auth';

/**
 * Robust CSV Line Parser that handles quotes and commas inside values
 */
function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return { orders: [], detectedMonth: '' };

    // Find header line (look for keywords like subtag, asin, tracking, commission, earnings)
    let headerIdx = -1;
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
        const lower = lines[i].toLowerCase();
        if ((lower.includes('asin') || lower.includes('product') || lower.includes('item')) &&
            (lower.includes('tag') || lower.includes('subtag') || lower.includes('earnings') || lower.includes('commission') || lower.includes('fee'))) {
            headerIdx = i;
            break;
        }
    }

    if (headerIdx === -1) {
        headerIdx = 0;
    }

    const parseRow = (str) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '"' || char === "'") {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(cur.trim().replace(/^["']|["']$/g, ''));
                cur = '';
            } else {
                cur += char;
            }
        }
        result.push(cur.trim().replace(/^["']|["']$/g, ''));
        return result;
    };

    const headers = parseRow(lines[headerIdx]).map(h => h.toLowerCase().trim());

    // Map column indexes
    const findCol = (...keywords) => {
        return headers.findIndex(h => keywords.some(k => h.includes(k)));
    };

    const subtagCol = findCol('subtag', 'ascsubtag', 'tracking id / subtag', 'tracking id', 'tag');
    const asinCol = findCol('asin', 'item id', 'product id');
    const titleCol = findCol('product title', 'item name', 'title', 'name', 'item');
    const revenueCol = findCol('revenue', 'item price', 'price', 'shipped revenue', 'amount');
    const commissionCol = findCol('commission', 'earnings', 'ad fees', 'advertising fee', 'fees', 'fee');
    const countryCol = findCol('marketplace', 'country');
    const dateCol = findCol('date', 'order date', 'shipped date');

    const cleanNumber = (val) => {
        if (!val) return 0;
        const cleaned = String(val).replace(/[^0-9.-]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    };

    const orders = [];
    let detectedMonth = '';

    for (let i = headerIdx + 1; i < lines.length; i++) {
        const row = parseRow(lines[i]);
        if (row.length === 0 || row.every(c => c === '')) continue;

        // Skip total / summary rows
        const firstVal = (row[0] || '').toLowerCase();
        if (firstVal.includes('total') || firstVal.includes('summary')) continue;

        const subtag = subtagCol !== -1 ? row[subtagCol] : '';
        const asin = asinCol !== -1 ? row[asinCol] : '';
        const title = titleCol !== -1 ? row[titleCol] : '';
        const revenue = revenueCol !== -1 ? cleanNumber(row[revenueCol]) : 0;
        const commission = commissionCol !== -1 ? cleanNumber(row[commissionCol]) : 0;
        const country = countryCol !== -1 ? (row[countryCol] || 'US') : 'US';
        const dateStr = dateCol !== -1 ? row[dateCol] : '';

        if (!detectedMonth && dateStr) {
            try {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                    detectedMonth = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
                }
            } catch {
                // ignore
            }
        }

        // Only include if has subtag, asin, or commission
        if (subtag || asin || commission > 0) {
            orders.push({
                asin: asin || 'B0-AMAZON',
                productName: title || `Amazon Item (${asin || 'General'})`,
                ascsubtag: subtag || '',
                subtag: subtag || '',
                revenue,
                commission,
                country,
                date: dateStr,
            });
        }
    }

    return { orders, detectedMonth: detectedMonth || new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }) };
}

export default function ImportAmazonCsvModal({ isOpen, onClose, onRefresh, showToast }) {
    const [rawText, setRawText] = useState('');
    const [fileName, setFileName] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const [month, setMonth] = useState(new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [showPasteArea, setShowPasteArea] = useState(false);

    if (!isOpen) return null;

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            setRawText(content);
            const { orders, detectedMonth } = parseCSV(content);
            if (detectedMonth) setMonth(detectedMonth);
            setParsedData(orders);
            if (orders.length === 0) {
                showToast('Warning: Could not parse any order rows. Check CSV headers.');
            }
        };
        reader.readAsText(file);
    };

    const handleTextParse = () => {
        if (!rawText.trim()) return;
        const { orders, detectedMonth } = parseCSV(rawText);
        if (detectedMonth) setMonth(detectedMonth);
        setParsedData(orders);
        if (orders.length === 0) {
            showToast('Warning: Could not parse any order rows. Check CSV headers.');
        }
    };

    const handleProcessImport = async () => {
        if (!parsedData || parsedData.length === 0) {
            showToast('No orders to import. Please upload a valid CSV first.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await authFetch('/api/admin/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orders: parsedData,
                    month,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setImportResult(data);
                showToast(`Success! Attributed ${data.attributedCount} orders to partner accounts.`);
                if (onRefresh) onRefresh();
            } else {
                showToast(data.error || 'Import failed. Check server logs.');
            }
        } catch {
            showToast('Network error while importing orders.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setRawText('');
        setFileName('');
        setParsedData(null);
        setImportResult(null);
        setShowPasteArea(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const partnerAttributedCount = parsedData ? parsedData.filter(o => o.ascsubtag && (o.ascsubtag.includes('usr_') || o.ascsubtag.includes('lnk-'))).length : 0;
    const totalCommissionSum = parsedData ? parsedData.reduce((acc, o) => acc + (o.commission || 0), 0) : 0;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
                padding: '1rem',
            }}
            onClick={handleClose}
        >
            <div
                className="ilearner-card animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '680px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '2rem',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        right: '1.25rem',
                        top: '1.25rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '6px',
                    }}
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: '#ECFDF5',
                            border: '1px solid #A7F3D0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Upload size={22} color="#059669" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            Import Amazon Earnings CSV
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                            Upload reports from Amazon Associates Central to attribute commissions to partners
                        </p>
                    </div>
                </div>

                {!importResult ? (
                    <div>
                        {/* Month Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                                Reporting Period:
                            </span>
                            <input
                                type="text"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                placeholder="e.g. Oct 2026"
                                style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    width: '140px',
                                    textAlign: 'center',
                                }}
                            />
                        </div>

                        {/* File Upload Drop Zone */}
                        <div
                            style={{
                                border: '2px dashed #CBD5E1',
                                borderRadius: '16px',
                                padding: '2rem 1.5rem',
                                textAlign: 'center',
                                backgroundColor: '#F8FAFC',
                                marginBottom: '1rem',
                                cursor: 'pointer',
                            }}
                            onClick={() => document.getElementById('amazon-csv-input')?.click()}
                        >
                            <input
                                id="amazon-csv-input"
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                <FileText size={24} color="#6366F1" />
                            </div>
                            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.25rem' }}>
                                {fileName ? `Selected: ${fileName}` : 'Click to upload Amazon Associates CSV'}
                            </h4>
                            <p style={{ fontSize: '0.7813rem', color: '#64748B', margin: 0 }}>
                                Supports standard Amazon "Consolidated Summary" and "Earnings Report" CSV files
                            </p>
                        </div>

                        {/* Toggle Paste text */}
                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowPasteArea(!showPasteArea)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#06B6D4',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                            >
                                {showPasteArea ? 'Hide manual paste box' : 'Or paste CSV text manually'}
                            </button>
                        </div>

                        {showPasteArea && (
                            <div style={{ marginBottom: '1rem' }}>
                                <textarea
                                    rows={5}
                                    value={rawText}
                                    onChange={(e) => setRawText(e.target.value)}
                                    placeholder="Paste raw CSV text here from Amazon..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        border: '1px solid #CBD5E1',
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleTextParse}
                                    style={{
                                        marginTop: '0.5rem',
                                        padding: '0.45rem 1rem',
                                        borderRadius: '8px',
                                        backgroundColor: '#0F172A',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontSize: '0.8125rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Parse Pasted CSV
                                </button>
                            </div>
                        )}

                        {/* Preview of Parsed Orders */}
                        {parsedData && parsedData.length > 0 && (
                            <div style={{ marginTop: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                                        Detected Orders ({parsedData.length})
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                            {partnerAttributedCount} Attributable
                                        </span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                            Total Fee: ${totalCommissionSum.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                                                <th style={{ padding: '0.5rem 0.75rem' }}>ASIN</th>
                                                <th style={{ padding: '0.5rem 0.75rem' }}>Product Title</th>
                                                <th style={{ padding: '0.5rem 0.75rem' }}>Subtag (Partner)</th>
                                                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>Commission</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parsedData.slice(0, 15).map((ord, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>
                                                        {ord.asin}
                                                    </td>
                                                    <td style={{ padding: '0.5rem 0.75rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {ord.productName}
                                                    </td>
                                                    <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', color: ord.ascsubtag?.includes('usr_') ? '#059669' : '#64748B', fontWeight: ord.ascsubtag?.includes('usr_') ? 700 : 500 }}>
                                                        {ord.ascsubtag || '—'}
                                                    </td>
                                                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                                                        ${ord.commission.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {parsedData.length > 15 && (
                                    <span style={{ fontSize: '0.725rem', color: '#64748B', display: 'block', marginTop: '0.375rem' }}>
                                        + {parsedData.length - 15} more rows detected
                                    </span>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#F1F5F9',
                                            border: '1px solid #CBD5E1',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            color: '#475569',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleProcessImport}
                                        disabled={isSubmitting}
                                        style={{
                                            flex: 2,
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#059669',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            opacity: isSubmitting ? 0.75 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin" />
                                                <span>Attributing Commissions...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={16} />
                                                <span>Confirm & Credit Partner Balances</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Success / Result View */
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <CheckCircle2 size={32} color="#059669" />
                        </div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem' }}>
                            Orders Successfully Processed!
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748B', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                            {importResult.message}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Attributed to Partners
                                </span>
                                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803D' }}>
                                    {importResult.attributedCount}
                                </div>
                            </div>
                            <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Unattributed (No Match)
                                </span>
                                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#475569' }}>
                                    {importResult.unattributedCount}
                                </div>
                            </div>
                        </div>

                        {/* Attribution Breakdown List */}
                        {importResult.results && importResult.results.filter(r => r.status === 'attributed').length > 0 && (
                            <div style={{ textAlign: 'left', marginBottom: '1.5rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                                            <th style={{ padding: '0.5rem 0.75rem' }}>Partner</th>
                                            <th style={{ padding: '0.5rem 0.75rem' }}>Rate</th>
                                            <th style={{ padding: '0.5rem 0.75rem' }}>Amazon Fee</th>
                                            <th style={{ padding: '0.5rem 0.75rem' }}>Partner Earned</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>New Balance Owed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {importResult.results.filter(r => r.status === 'attributed').map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>{item.partnerName}</td>
                                                <td style={{ padding: '0.5rem 0.75rem' }}>{item.commissionRate}</td>
                                                <td style={{ padding: '0.5rem 0.75rem' }}>${item.rawCommission.toFixed(2)}</td>
                                                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: '#059669' }}>${item.partnerEarned.toFixed(2)}</td>
                                                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>${item.newCurrentlyOwed.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleClose}
                            style={{
                                width: '100%',
                                padding: '0.85rem',
                                borderRadius: '12px',
                                backgroundColor: '#0F172A',
                                color: '#FFFFFF',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.9375rem',
                                cursor: 'pointer',
                            }}
                        >
                            Done & Refresh Platform Reports
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
