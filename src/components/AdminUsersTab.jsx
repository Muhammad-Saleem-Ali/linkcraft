'use client';
import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, ExternalLink, Edit2, Check, X, CreditCard, Globe, Phone, Mail } from 'lucide-react';
export default function AdminUsersTab({ users, onUpdateStatus, onUpdateCommission, showToast, }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingCommissionId, setEditingCommissionId] = useState(null);
    const [commissionInput, setCommissionInput] = useState(0.70);
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
            showToast(`User status updated to ${newStatus}`);
        }
        catch (err) {
            showToast(err.message || 'Failed to update user status');
        }
    };
    const handleCommissionSubmit = async (userId) => {
        try {
            await onUpdateCommission(userId, commissionInput);
            setEditingCommissionId(null);
            showToast(`Commission rate updated to ${(commissionInput * 100).toFixed(0)}%`);
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
      {selectedUser && (<div style={{
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
          <div className="ilearner-card animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '2rem', position: 'relative', borderRadius: '24px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
              <X size={20}/>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: '#EEF2FF',
                color: '#6366F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
            }}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {selectedUser.name}
                </h3>
                <span style={{ fontSize: '0.8438rem', color: '#64748B' }}>
                  ID: {selectedUser.id} • Joined {selectedUser.createdAt}
                </span>
              </div>
            </div>

            {/* Partner Info Details List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <Mail size={16} color="#64748B"/>
                <span style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 600 }}>{selectedUser.email}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <Phone size={16} color="#64748B"/>
                <span style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 600 }}>{selectedUser.phone || 'Phone not provided'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                <Globe size={16} color="#64748B"/>
                <span style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 600 }}>
                  Public Store: <a href={`/u/${selectedUser.storeSlug}`} target="_blank" rel="noreferrer" style={{ color: '#06B6D4' }}>/u/{selectedUser.storeSlug}</a>
                </span>
              </div>

              <div style={{ padding: '0.875rem', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', color: '#92400E', fontWeight: 700, fontSize: '0.8438rem' }}>
                  <CreditCard size={16}/>
                  <span>Payout Bank Account Details</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#B45309', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span>Bank: <strong>{selectedUser.bankName || 'Not configured'}</strong></span>
                  <span>Title: <strong>{selectedUser.accountTitle || 'Not configured'}</strong></span>
                  <span>IBAN: <strong style={{ fontFamily: 'monospace' }}>{selectedUser.iban || 'Not configured'}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Status Toggle Actions in Modal */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {selectedUser.status !== 'active' && (<button onClick={() => {
                    handleStatusChange(selectedUser.id, 'active');
                    setSelectedUser({ ...selectedUser, status: 'active' });
                }} className="btn-emerald" style={{ flex: 1, padding: '0.625rem', fontSize: '0.875rem' }}>
                  <CheckCircle size={16}/>
                  <span>Activate / Approve</span>
                </button>)}
              {selectedUser.status !== 'suspended' && (<button onClick={() => {
                    handleStatusChange(selectedUser.id, 'suspended');
                    setSelectedUser({ ...selectedUser, status: 'suspended' });
                }} style={{
                    flex: 1,
                    padding: '0.625rem',
                    borderRadius: '12px',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                }}>
                  <XCircle size={16}/>
                  <span>Suspend Account</span>
                </button>)}
            </div>
          </div>
        </div>)}
    </div>);
}
