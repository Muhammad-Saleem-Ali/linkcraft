'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Bell, ChevronDown, Link as LinkIcon, Plus, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'profile', label: 'Profile' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{ width: '100%', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Bar */}
      <div
        style={{
          height: '64px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Brand Logo */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #F59E0B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LinkIcon size={16} color="#FFFFFF" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: 1.1 }}>
              LinkCraft
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#06B6D4', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Affiliate Engine
            </span>
          </div>
        </Link>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }} ref={dropdownRef}>
          {/* Quick Create Link Header Button */}
          <Link
            href="/create"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: '#38BDF8',
              padding: '0.4rem 0.875rem',
              borderRadius: '99px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
          >
            <Plus size={15} />
            <span>Create Link</span>
          </Link>

          {/* Language Selector */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              padding: '0.375rem 0.75rem',
              borderRadius: '99px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Globe size={15} />
            <span>EN</span>
          </button>

          {/* Notifications Bell */}
          <button
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Bell size={17} />
          </button>

          {/* User Profile Trigger */}
          <div
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: isUserMenuOpen ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              padding: '0.3125rem 0.75rem 0.3125rem 0.3125rem',
              borderRadius: '99px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.8125rem',
              }}
            >
              A
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>Ahmar</span>
            <ChevronDown size={14} color="#94A3B8" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '210px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
                border: '1px solid #E2E8F0',
                padding: '0.5rem',
                zIndex: 1000,
              }}
            >
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  router.push('/create');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#0F172A',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Plus size={18} color="#06B6D4" />
                <span>Create Showcase Link</span>
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  router.push('/dashboard');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#0F172A',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LayoutDashboard size={18} color="#64748B" />
                <span>Dashboard</span>
              </button>

              <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '0.375rem 0' }} />

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  router.push('/login');
                }}
                style={{
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={18} color="#EF4444" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      {setActiveTab && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 2rem',
            display: 'flex',
            gap: '2.5rem',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.875rem 0',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.9375rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#06B6D4' : '#64748B',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {tab.label}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#06B6D4',
                      borderRadius: '3px 3px 0 0',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
