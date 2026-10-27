'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '../utils/auth.js';
import { ShieldCheck, LayoutDashboard, Users, FileBarChart, CreditCard, Link2, LogOut, ChevronDown, RefreshCw, ExternalLink } from 'lucide-react';
export default function AdminHeader({ activeTab, setActiveTab, onRefresh, pendingApprovals = 0, pendingPayouts = 0, }) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const tabs = [
        { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Affiliates Management', icon: Users, badge: pendingApprovals > 0 ? pendingApprovals : undefined },
        { id: 'reports', label: 'Reports & Revenue', icon: FileBarChart },
        { id: 'payouts', label: 'Payout Approvals', icon: CreditCard, badge: pendingPayouts > 0 ? pendingPayouts : undefined },
        { id: 'links', label: 'Links Audit', icon: Link2 },
    ];
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (<header style={{ width: '100%', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Bar */}
      <div style={{
            height: '64px',
            backgroundColor: '#090D16',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
        {/* Brand Logo & Admin Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
        }}>
              <ShieldCheck size={20} color="#FFFFFF"/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: 1.1 }}>
                  LinkCraft
                </span>
                <span style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            color: '#818CF8',
            padding: '0.15rem 0.5rem',
            borderRadius: '99px',
            border: '1px solid rgba(129, 140, 248, 0.35)',
        }}>
                  Admin Portal
                </span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 600 }}>
                Amazon Associate Master Controller
              </span>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }} ref={dropdownRef}>
          {onRefresh && (<button onClick={onRefresh} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#E2E8F0',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '0.375rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
            }} title="Refresh Platform Data">
              <RefreshCw size={14}/>
              <span>Refresh</span>
            </button>)}

          {/* Switch to User Dashboard View */}
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#06B6D4',
            color: '#FFFFFF',
            padding: '0.45rem 1rem',
            borderRadius: '99px',
            fontSize: '0.8125rem',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 2px 10px rgba(6, 182, 212, 0.35)',
            transition: 'all 0.2s',
        }}>
            <LayoutDashboard size={15}/>
            <span>User Dashboard</span>
          </Link>

          {/* Admin User Trigger */}
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: isMenuOpen ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
            padding: '0.3125rem 0.75rem 0.3125rem 0.3125rem',
            borderRadius: '99px',
            cursor: 'pointer',
        }}>
            <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.8125rem',
        }}>
              A
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>Admin</span>
            <ChevronDown size={14} color="#94A3B8" style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}/>
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (<div className="animate-fade-in" style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: '2rem',
                width: '220px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
                border: '1px solid #E2E8F0',
                padding: '0.5rem',
                zIndex: 1000,
            }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F1F5F9', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Signed in as Superadmin</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>admin@ilearner.dev</span>
              </div>

              <button onClick={() => {
                setIsMenuOpen(false);
                router.push('/dashboard');
            }} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#0F172A',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
            }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <LayoutDashboard size={18} color="#06B6D4"/>
                <span>Switch to User Dashboard</span>
              </button>

              <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '0.375rem 0' }}/>

              <button onClick={() => {
                setIsMenuOpen(false);
                logout();
            }} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#EF4444',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
            }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <LogOut size={18} color="#EF4444"/>
                <span>Logout</span>
              </button>
            </div>)}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 2rem',
            display: 'flex',
            gap: '2rem',
            overflowX: 'auto',
        }}>
        {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    padding: '0.9375rem 0',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? '#6366F1' : '#64748B',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap',
                }}>
              <Icon size={16} color={isActive ? '#6366F1' : '#94A3B8'}/>
              <span>{tab.label}</span>
              {tab.badge !== undefined && (<span style={{
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '99px',
                    }}>
                  {tab.badge}
                </span>)}
              {isActive && (<div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: '#6366F1',
                        borderRadius: '3px 3px 0 0',
                    }}/>)}
            </button>);
        })}
      </div>
    </header>);
}
