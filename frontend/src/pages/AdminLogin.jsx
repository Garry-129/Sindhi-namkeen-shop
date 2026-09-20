import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, KeyRound, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { adminLoginApi } from '../services/api';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginAdminContext } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await adminLoginApi({ username, password });

            if (data && data.success) {
                loginAdminContext(data.token, data.admin);
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            // Handle rate limit (429) or generic failure
            if (err.status === 429 || (err.message && err.message.toLowerCase().includes('too many'))) {
                setError('Too many attempts, please try again in 15 minutes');
            } else {
                setError(err.message || 'Admin login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', flexGrow: 1, maxWidth: '440px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ArrowLeft size={16} /> Back to Shop
                    </Link>
                </div>

                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem 1.75rem',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-light)',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 0.75rem auto',
                        }}>
                            <Shield size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Admin Portal Login</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Sindhi Namkeen & Dry Fruits, Rohtak
                        </p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter admin username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem 0.8rem 0.65rem 2.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter admin password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem 0.8rem 0.65rem 2.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                        >
                            <Lock size={16} />
                            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminLogin;
