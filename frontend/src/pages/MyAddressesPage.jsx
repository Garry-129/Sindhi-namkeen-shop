import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Plus, Edit, Trash2, CheckCircle2, User, Phone, Save, AlertCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
    fetchCustomerProfileApi,
    updateCustomerProfileApi,
    addCustomerAddressApi,
    updateCustomerAddressApi,
    deleteCustomerAddressApi,
} from '../services/api';

const MyAddressesPage = () => {
    const navigate = useNavigate();
    const { isCustomerAuthenticated, customerUser, updateCustomerUser } = useCustomerAuth();

    const [addresses, setAddresses] = useState([]);
    const [name, setName] = useState(customerUser?.name || '');
    const [phone, setPhone] = useState(customerUser?.phone || '');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState('');

    // Address Form State
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [label, setLabel] = useState('Home');
    const [fullAddress, setFullAddress] = useState('');
    const [isDefault, setIsDefault] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [addressLoading, setAddressLoading] = useState(false);

    useEffect(() => {
        if (!isCustomerAuthenticated) {
            navigate('/login?redirect=my-addresses');
            return;
        }

        const loadProfile = async () => {
            try {
                const res = await fetchCustomerProfileApi();
                if (res && res.success && res.customer) {
                    setAddresses(res.customer.addresses || []);
                    setName(res.customer.name || '');
                    setPhone(res.customer.phone || '');
                    updateCustomerUser(res.customer);
                }
            } catch (err) {
                console.error('Failed to load profile & addresses', err);
            }
        };

        loadProfile();
    }, [isCustomerAuthenticated, navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMsg('');
        setProfileLoading(true);
        try {
            const res = await updateCustomerProfileApi({ name, phone });
            if (res && res.success && res.customer) {
                updateCustomerUser(res.customer);
                setProfileMsg('Personal details updated successfully!');
            }
        } catch (err) {
            setProfileMsg('Failed to update details');
        } finally {
            setProfileLoading(false);
            setTimeout(() => setProfileMsg(''), 3000);
        }
    };

    const handleOpenForm = (addr = null) => {
        setAddressError('');
        if (addr) {
            setEditingAddressId(addr._id);
            setLabel(addr.label || 'Home');
            setFullAddress(addr.fullAddress || '');
            setIsDefault(Boolean(addr.isDefault));
        } else {
            setEditingAddressId(null);
            setLabel('Home');
            setFullAddress('');
            setIsDefault(addresses.length === 0);
        }
        setIsFormOpen(true);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setAddressError('');

        if (!fullAddress.trim()) {
            setAddressError('Please enter full delivery address.');
            return;
        }

        setAddressLoading(true);
        try {
            let res;
            if (editingAddressId) {
                res = await updateCustomerAddressApi(editingAddressId, { label, fullAddress, isDefault });
            } else {
                res = await addCustomerAddressApi({ label, fullAddress, isDefault });
            }

            if (res && res.success) {
                setAddresses(res.addresses || []);
                setIsFormOpen(false);
            } else {
                setAddressError(res.message || 'Failed to save address');
            }
        } catch (err) {
            setAddressError(err.message || 'Error saving address');
        } finally {
            setAddressLoading(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const res = await deleteCustomerAddressApi(id);
                if (res && res.success) {
                    setAddresses(res.addresses || []);
                }
            } catch (err) {
                alert('Failed to delete address');
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-cream)' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', flexGrow: 1, maxWidth: '960px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        <MapPin size={18} />
                        <span>Customer Portal</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        Saved Delivery Addresses
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Manage your delivery addresses for quick and effortless checkout.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.75rem' }} className="address-layout">
                    {/* Personal Info Box */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-light)',
                        height: 'fit-content',
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={18} color="var(--primary)" />
                            Personal Details
                        </h3>

                        {profileMsg && (
                            <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '0.6rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.82rem' }}>
                                {profileMsg}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Email (Account ID)</label>
                                <input
                                    type="email"
                                    disabled
                                    value={customerUser?.email || ''}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem', backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="btn-secondary"
                                style={{ padding: '0.65rem', marginTop: '0.4rem', fontSize: '0.85rem', justifyContent: 'center' }}
                            >
                                <Save size={16} />
                                <span>{profileLoading ? 'Saving...' : 'Update Details'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Address List & Add Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                Address Book ({addresses.length})
                            </h3>

                            {!isFormOpen && (
                                <button
                                    onClick={() => handleOpenForm()}
                                    className="btn-primary"
                                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
                                >
                                    <Plus size={16} />
                                    <span>Add New Address</span>
                                </button>
                            )}
                        </div>

                        {/* Add/Edit Form Box */}
                        {isFormOpen && (
                            <div style={{
                                backgroundColor: '#ffffff',
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.5rem',
                                border: '2px solid var(--primary)',
                                boxShadow: 'var(--shadow-md)',
                            }}>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
                                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                                </h4>

                                {addressError && (
                                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <AlertCircle size={16} />
                                        <span>{addressError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Address Label</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {['Home', 'Work', 'Other'].map((l) => (
                                                <button
                                                    type="button"
                                                    key={l}
                                                    onClick={() => setLabel(l)}
                                                    style={{
                                                        padding: '0.4rem 0.85rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: label === l ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                        backgroundColor: label === l ? 'var(--primary-light)' : '#ffffff',
                                                        color: label === l ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: 700,
                                                        fontSize: '0.82rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Complete Delivery Address</label>
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="House / Flat No., Street, Area, Model Town, Rohtak, Pincode"
                                            value={fullAddress}
                                            onChange={(e) => setFullAddress(e.target.value)}
                                            style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem', resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            id="isDefaultCheck"
                                            checked={isDefault}
                                            onChange={(e) => setIsDefault(e.target.checked)}
                                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                        />
                                        <label htmlFor="isDefaultCheck" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                            Set as default delivery address
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        <button
                                            type="submit"
                                            disabled={addressLoading}
                                            className="btn-primary"
                                            style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
                                        >
                                            {addressLoading ? 'Saving...' : 'Save Address'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsFormOpen(false)}
                                            className="btn-secondary"
                                            style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* List of Saved Addresses */}
                        {addresses.length === 0 && !isFormOpen ? (
                            <div style={{ backgroundColor: '#ffffff', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                                <MapPin size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
                                <h4 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>No saved addresses yet</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Add a saved address to speed up checkout on your future orders.</p>
                                <button onClick={() => handleOpenForm()} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}>
                                    Add Address Now
                                </button>
                            </div>
                        ) : (
                            addresses.map((addr) => (
                                <div key={addr._id} style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1.25rem 1.5rem',
                                    border: addr.isDefault ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                    boxShadow: 'var(--shadow-sm)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                                {addr.label || 'Address'}
                                            </span>
                                            {addr.isDefault && (
                                                <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)' }}>
                                                    Default Address
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                            📍 {addr.fullAddress}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                        <button
                                            onClick={() => handleOpenForm(addr)}
                                            style={{ padding: '0.4rem 0.6rem', backgroundColor: 'var(--bg-muted)', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-light)' }}
                                            title="Edit Address"
                                        >
                                            <Edit size={16} color="var(--text-main)" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(addr._id)}
                                            style={{ padding: '0.4rem 0.6rem', backgroundColor: '#fef2f2', borderRadius: '4px', cursor: 'pointer', border: '1px solid #fecaca' }}
                                            title="Delete Address"
                                        >
                                            <Trash2 size={16} color="var(--danger)" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            <style>{`
        @media (max-width: 768px) {
          .address-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default MyAddressesPage;
