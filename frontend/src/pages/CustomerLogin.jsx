import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, UserPlus, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { customerLoginApi } from '../services/api';

const CustomerLogin = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectParam = searchParams.get('redirect');
    const redirectUrl = redirectParam ? `/${redirectParam}` : '/';

    const { isCustomerAuthenticated, loginCustomerContext } = useCustomerAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isCustomerAuthenticated) {
            navigate(redirectUrl, { replace: true });
        }
    }, [isCustomerAuthenticated, navigate, redirectUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const res = await customerLoginApi({ email, password });
            if (res && res.success && res.token) {
                loginCustomerContext(res.token, res.customer);
                navigate(redirectUrl, { replace: true });
            } else {
                setError(res.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError(err.message || 'Unable to log in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-cream)' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: '100%',
                    maxWidth: '460px',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2.5rem 2rem',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-light)',
                }}>
                    {/* Redirect Notice Banner */}
                    {redirectParam === 'checkout' && (
                        <div style={{
                            backgroundColor: 'var(--primary-light)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--primary)',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                        }}>
                            <ShoppingBag size={18} />
                            <span>Please sign in to complete your order.</span>
                        </div>
                    )}

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.75rem',
                        }}>
                            <LogIn size={26} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                            Customer Sign In
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                            Sindhi Namkeen & Dry Fruits • Model Town Park, Rohtak
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontSize: '0.88rem',
                        }}>
                            <AlertCircle size={18} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="email"
                                    required
                                    placeholder="yourname@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-light)',
                                        fontSize: '0.95rem',
                                        backgroundColor: 'var(--bg-cream)',
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-light)',
                                        fontSize: '0.95rem',
                                        backgroundColor: 'var(--bg-cream)',
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                padding: '0.85rem',
                                marginTop: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                fontWeight: 700,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    {/* Footer links */}
                    <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account yet?{' '}
                        <Link
                            to={redirectParam ? `/register?redirect=${redirectParam}` : '/register'}
                            style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CustomerLogin;
