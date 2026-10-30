'use client';
import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, ExternalLink, Edit2, Check, X, CreditCard, Globe, Phone, Mail, Clock, UserPlus } from 'lucide-react';
import CreateUserModal from '@/components/CreateUserModal';

export default function AdminUsersTab({ users, onUpdateStatus, onUpdateCommission, onCreateUser, showToast }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingCommissionId, setEditingCommissionId] = useState(null);
    const [commissionInput, setCommissionInput] = useState(0.70);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const filteredUsers = users.filter((u) => {
        if (statusFilter !== 'all' && u.status !== statusFilter)
            return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                (u.storeSlug && u.storeSlug.toLowerCase().includes(q)));
        }
        return true;
    });
    const handleStatusChange = async (userId, newStatus) => {
        try {
            await onUpdateStatus(userId, newStatus);
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
            }
            if (newStatus === 'suspended') {
                showToast('User account suspended & session automatically terminated');
            } else {
                showToast(`User status updated to ${newStatus}`);
            }
        }
        catch (err) {
            showToast(err.message || 'Failed to update user status');
        }
    };
    const handleCommissionSubmit = async (userId, rateValue) => {
        const rate = rateValue !== undefined ? rateValue : commissionInput;
        try {
            await onUpdateCommission(userId, rate);
            setEditingCommissionId(null);
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(prev => prev ? { ...prev, commissionRate: rate } : null);
            }
            showToast(`Commission rate updated to ${(rate * 100).toFixed(0)}%`);
        }
        catch (err) {
            showToast(err.message || 'Failed to update commission rate');
        }
    };
    return (<div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
            Affiliate Partner Accounts
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
            Inspect user statuses, approve pending applications, configure commission splits, and audit earnings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Create New User Button */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              transition: 'opacity 0.2s',
            }}
          >
            <UserPlus size={15} />
            <span>Create New User</span>
          </button>

          {/* Filter Pills Bar */}
          <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: '#FFFFFF', padding: '0.375rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          {['all', 'active', 'pending', 'suspended'].map((st) => {
            const isActive = statusFilter === st;
            const count = st === 'all' ? users.length : users.filter((u) => u.status === st).length;
            return (<button key={st} onClick={() => setStatusFilter(st)} style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? '#6366F1' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    transition: 'all 0.15s',
                }}>
                <span>{st}</span>
                <span style={{
                    fontSize: '0.6875rem',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#64748B',
                    padding: '0.1rem 0.375rem',
                    borderRadius: '99px',
                }}>
                  {count}
                </span>
              </button>);
        })}
        </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="ilearner-card" style={{ padding: '1.5rem' }}>
        
        {/* Search Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}/>
            <input type="text" placeholder="Search by name, email or store slug..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field" style={{ paddingLeft: '2.375rem', padding: '0.5rem 0.875rem', fontSize: '0.8438rem' }}/>
          </div>

          <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            Showing <strong>{filteredUsers.length}</strong> of {users.length} partners
          </div>
        </div>

        {/* Users Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Partner / Store</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Commission</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Links / Clicks</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'right' }}>Currently Owed</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'right' }}>Lifetime Earned</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E1B4B', marginBottom: '0.25rem' }}>
                      No affiliate partners found
                    </div>
                    <div style={{ fontSize: '0.8125rem' }}>
                      Registered affiliate partner accounts will appear here.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
            const isEditing = editingCommissionId === user.id;
            return (<tr key={user.id} style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background-color 0.15s',
                }}>
                    {/* Partner Name & Email */}
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: user.status === 'active' ? '#EEF2FF' : user.status === 'pending' ? '#FFFBEB' : '#FEF2F2',
                    color: user.status === 'active' ? '#6366F1' : user.status === 'pending' ? '#D97706' : '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9375rem',
                }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>{user.name}</div>
                          <div style={{ fontSize: '0.7813rem', color: '#64748B' }}>{user.email}</div>
                          {user.storeSlug && (<a href={`/u/${user.storeSlug}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
                              <span>/u/{user.storeSlug}</span>
                              <ExternalLink size={11}/>
                            </a>)}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <select value={user.status} onChange={(e) => handleStatusChange(user.id, e.target.value)} style={{
                    padding: '0.3125rem 0.625rem',
                    borderRadius: '99px',
                    border: user.status === 'active' ? '1px solid #A7F3D0' : user.status === 'pending' ? '1px solid #FDE68A' : '1px solid #FECACA',
                    backgroundColor: user.status === 'active' ? '#ECFDF5' : user.status === 'pending' ? '#FFFBEB' : '#FEF2F2',
                    color: user.status === 'active' ? '#047857' : user.status === 'pending' ? '#B45309' : '#DC2626',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    outline: 'none',
                }}>
                        <option value="active">Active ✓</option>
                        <option value="pending">Pending ⏳</option>
                        <option value="suspended">Suspended ✖</option>
                      </select>
                    </td>

                    {/* Commission Rate */}
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      {isEditing ? (<div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <select value={commissionInput} onChange={(e) => setCommissionInput(parseFloat(e.target.value))} style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #6366F1', fontSize: '0.75rem', fontWeight: 700 }}>
                            <option value="0.50">50%</option>
                            <option value="0.60">60%</option>
                            <option value="0.65">65%</option>
                            <option value="0.70">70%</option>
                            <option value="0.75">75%</option>
                            <option value="0.80">80%</option>
                            <option value="0.85">85%</option>
                            <option value="0.90">90%</option>
                          </select>
                          <button onClick={() => handleCommissionSubmit(user.id)} style={{ padding: '0.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', cursor: 'pointer' }} title="Save Commission">
                            <Check size={13}/>
                          </button>
                          <button onClick={() => setEditingCommissionId(null)} style={{ padding: '0.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#E2E8F0', color: '#64748B', cursor: 'pointer' }} title="Cancel">
                            <X size={13}/>
                          </button>
                        </div>) : (<button onClick={() => {
                        setEditingCommissionId(user.id);
                        setCommissionInput(user.commissionRate);
                    }} style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#F8FAFC',
                        fontWeight: 800,
                        color: '#4F46E5',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                    }} title="Click to edit commission split">
                          <span>{(user.commissionRate * 100).toFixed(0)}%</span>
                          <Edit2 size={11} color="#94A3B8"/>
                        </button>)}
                    </td>

                    {/* Links / Clicks */}
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{user.linksCount}</span>
                      <span style={{ color: '#94A3B8' }}> / </span>
                      <span style={{ fontWeight: 800, color: '#06B6D4' }}>{user.clicksCount}</span>
                    </td>

                    {/* Currently Owed */}
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 800, color: user.currentlyOwed > 0 ? '#D97706' : '#94A3B8' }}>
                      Rs. {user.currentlyOwed.toLocaleString()}
                    </td>

                    {/* Lifetime Earned */}
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 800, color: '#10B981' }}>
                      Rs. {user.lifetimeEarnings.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                      <button onClick={() => setSelectedUser(user)} style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#4F46E5',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                }}>
                        Inspect
                      </button>
                    </td>
                  </tr>);
        }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Partner Detail Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }} onClick={() => setSelectedUser(null)}>
          <div className="ilearner-card animate-fade-in" style={{ width: '100%', maxWidth: '560px', padding: '2rem', position: 'relative', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
              <X size={20}/>
            </button>

            {/* Header with Avatar & Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: selectedUser.status === 'active' ? '#ECFDF5' : selectedUser.status === 'pending' ? '#FFFBEB' : '#FEF2F2',
                  color: selectedUser.status === 'active' ? '#059669' : selectedUser.status === 'pending' ? '#D97706' : '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                }}>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {selectedUser.name}
                    </h3>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '99px',
                      backgroundColor: selectedUser.status === 'active' ? '#ECFDF5' : selectedUser.status === 'pending' ? '#FFFBEB' : '#FEF2F2',
                      color: selectedUser.status === 'active' ? '#047857' : selectedUser.status === 'pending' ? '#B45309' : '#DC2626',
                      border: selectedUser.status === 'active' ? '1px solid #A7F3D0' : selectedUser.status === 'pending' ? '1px solid #FDE68A' : '1px solid #FECACA',
                    }}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                    ID: {selectedUser.id} • Joined {selectedUser.createdAt}
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Performance Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.625rem 0.5rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Links</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>{selectedUser.linksCount || 0}</span>
              </div>
              <div style={{ padding: '0.625rem 0.5rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Clicks</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#06B6D4' }}>{selectedUser.clicksCount || 0}</span>
              </div>
              <div style={{ padding: '0.625rem 0.5rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Owed</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: selectedUser.currentlyOwed > 0 ? '#D97706' : '#64748B' }}>Rs. {selectedUser.currentlyOwed || 0}</span>
              </div>
              <div style={{ padding: '0.625rem 0.5rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Earned</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#10B981' }}>Rs. {selectedUser.lifetimeEarnings || 0}</span>
              </div>
            </div>

            {/* Account Status Control: 3-Way Switcher */}
            <div style={{ marginBottom: '1.25rem', padding: '1rem', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Account Approval & Access Status
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedUser.id, 'active')}
                  style={{
                    padding: '0.625rem 0.5rem',
                    borderRadius: '10px',
                    border: selectedUser.status === 'active' ? '2px solid #059669' : '1px solid #CBD5E1',
                    backgroundColor: selectedUser.status === 'active' ? '#ECFDF5' : '#FFFFFF',
                    color: selectedUser.status === 'active' ? '#047857' : '#64748B',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <CheckCircle size={15} color={selectedUser.status === 'active' ? '#059669' : '#94A3B8'} />
                  <span>Active</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedUser.id, 'pending')}
                  style={{
                    padding: '0.625rem 0.5rem',
                    borderRadius: '10px',
                    border: selectedUser.status === 'pending' ? '2px solid #D97706' : '1px solid #CBD5E1',
                    backgroundColor: selectedUser.status === 'pending' ? '#FFFBEB' : '#FFFFFF',
                    color: selectedUser.status === 'pending' ? '#B45309' : '#64748B',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <Clock size={15} color={selectedUser.status === 'pending' ? '#D97706' : '#94A3B8'} />
                  <span>Pending</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedUser.id, 'suspended')}
                  style={{
                    padding: '0.625rem 0.5rem',
                    borderRadius: '10px',
                    border: selectedUser.status === 'suspended' ? '2px solid #DC2626' : '1px solid #CBD5E1',
                    backgroundColor: selectedUser.status === 'suspended' ? '#FEF2F2' : '#FFFFFF',
                    color: selectedUser.status === 'suspended' ? '#DC2626' : '#64748B',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <XCircle size={15} color={selectedUser.status === 'suspended' ? '#DC2626' : '#94A3B8'} />
                  <span>Suspended</span>
                </button>
              </div>
            </div>

            {/* Commission Profit Split Configuration in Modal */}
            <div style={{ marginBottom: '1.25rem', padding: '1rem', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Commission Profit Split
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6366F1', fontWeight: 700 }}>
                  Current: {(selectedUser.commissionRate * 100).toFixed(0)}%
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 0.5rem' }}>
                The affiliate earns this % of Amazon's commission fee. The platform retains the remaining {(100 - (selectedUser.commissionRate * 100)).toFixed(0)}%.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={selectedUser.commissionRate}
                  onChange={(e) => handleCommissionSubmit(selectedUser.id, parseFloat(e.target.value))}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="0.50">50% to Partner / 50% Platform Profit</option>
                  <option value="0.60">60% to Partner / 40% Platform Profit</option>
                  <option value="0.65">65% to Partner / 35% Platform Profit</option>
                  <option value="0.70">70% to Partner / 30% Platform Profit (Default)</option>
                  <option value="0.75">75% to Partner / 25% Platform Profit</option>
                  <option value="0.80">80% to Partner / 20% Platform Profit</option>
                  <option value="0.85">85% to Partner / 15% Platform Profit</option>
                  <option value="0.90">90% to Partner / 10% Platform Profit (VIP)</option>
                </select>
              </div>
            </div>

            {/* Partner Info Details List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <Mail size={16} color="#64748B"/>
                <span style={{ fontSize: '0.8438rem', color: '#0F172A', fontWeight: 600 }}>{selectedUser.email}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <Phone size={16} color="#64748B"/>
                <span style={{ fontSize: '0.8438rem', color: '#0F172A', fontWeight: 600 }}>{selectedUser.phone || 'Phone not provided'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <Globe size={16} color="#64748B"/>
                <span style={{ fontSize: '0.8438rem', color: '#0F172A', fontWeight: 600 }}>
                  Public Store: <a href={`/u/${selectedUser.storeSlug}`} target="_blank" rel="noreferrer" style={{ color: '#06B6D4' }}>/u/{selectedUser.storeSlug}</a>
                </span>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: '#92400E', fontWeight: 700, fontSize: '0.8125rem' }}>
                  <CreditCard size={15}/>
                  <span>Payout Bank Account Details</span>
                </div>
                <div style={{ fontSize: '0.7813rem', color: '#B45309', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span>Bank: <strong>{selectedUser.bankName || 'Not configured'}</strong></span>
                  <span>Title: <strong>{selectedUser.accountTitle || 'Not configured'}</strong></span>
                  <span>IBAN: <strong style={{ fontFamily: 'monospace' }}>{selectedUser.iban || 'Not configured'}</strong></span>
                </div>
              </div>
            </div>

            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Create New User Modal */}
      {isCreateModalOpen && (
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateUser={onCreateUser}
          showToast={showToast}
        />
      )}
    </div>);
}
