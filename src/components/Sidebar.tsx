'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Link2,
  Wallet,
  Megaphone,
  Settings,
  LogOut,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X,
  Link as LinkIcon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'links', label: 'Affiliate Links', icon: Link2, badge: '12 active' },
    { id: 'payouts', label: 'Earnings & Payouts', icon: Wallet, badge: '$1,840.50' },
    { id: 'assets', label: 'Marketing Assets', icon: Megaphone, badge: 'New' },
    { id: 'settings', label: 'Partner Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}

      <aside
        style={{
          width: '280px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.75rem 1.25rem',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          transition: 'transform 0.3s ease',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        }}
        className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        <div>
          {/* Brand Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              paddingLeft: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #F59E0B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)',
                }}
              >
                <LinkIcon size={24} color="#FFFFFF" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  LinkCraft
                </h1>
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    color: '#06B6D4',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Affiliate Engine
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="mobile-close-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'none',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                    color: isActive ? '#38BDF8' : '#94A3B8',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <IconComponent size={20} color={isActive ? '#06B6D4' : '#94A3B8'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '99px',
                        backgroundColor: isActive ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#FFFFFF' : '#94A3B8',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.25rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.875rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#06B6D4',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                }}
              >
                A
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                  Ahmar
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Verified Associate</span>
              </div>
            </div>

            <Link href="/login" style={{ color: '#94A3B8' }}>
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
