import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Clock3, Mail, ShieldCheck, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { requestCustomerOtpApi, verifyCustomerOtpApi } from '../services/api';

const CustomerOtpAuth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectParam = searchParams.get('redirect');
    const redirectUrl = redirectParam ? `/${redirectParam}` : '/';
    const { isCustomerAuthenticated, loginCustomerContext } = useCustomerAuth();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('email');
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        if (isCustomerAuthenticated) {
            navigate(redirectUrl, { replace: true });
        }
    }, [isCustomerAuthenticated, navigate, redirectUrl]);

    useEffect(() => {
        if (step !== 'otp' || countdown <= 0) return undefined;
        const timer = window.setInterval(() => {
            setCountdown((remaining) => Math.max(remaining - 1, 0));
        }, 1000);
        return () => window.clearInterval(timer);
    }, [step, countdown]);

    const sendCode = async () => {
        setError('');
        setNotice('');
        setLoading(true);
        try {
            const response = await requestCustomerOtpApi({ email: email.trim() });
            setStep('otp');
            setOtp('');
            setCountdown(response.resendAvailableInSeconds || 60);
            setNotice(response.message || 'If this address can receive email, a verification code has been sent.');
        } catch (requestError) {
            setError(requestError.message || 'Unable to send a verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        await sendCode();
    };

    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setNotice('');
        setLoading(true);
        try {
            const response = await verifyCustomerOtpApi({ email: email.trim(), otp });
            if (response.success && response.token) {
                loginCustomerContext(response.token, response.customer);
                setNotice('Email verified successfully.');
                navigate(redirectUrl, { replace: true });
            } else {
                setError(response.message || 'Unable to verify the code.');
            }
        } catch (verificationError) {
            setError(verificationError.message || 'The code is invalid or expired. Request a new code and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeEmail = () => {
        setStep('email');
        setOtp('');
        setCountdown(0);
        setError('');
        setNotice('');
    };

    const formatCountdown = `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-cream)' }}>
            <Navbar />
            <main className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <section style={{ width: '100%', maxWidth: '460px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: 'clamp(1.5rem, 6vw, 2.5rem) 2rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
                    {redirectParam === 'checkout' && (
                        <div style={{ backgroundColor: 'var(--primary-light)', border: '1px solid var(--border-light)', color: 'var(--primary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <ShoppingBag size={18} />
                            <span>Sign in to complete your order.</span>
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                            {step === 'email' ? <Mail size={25} /> : <ShieldCheck size={26} />}
                        </div>
                        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                            {step === 'email' ? 'Enter your email' : 'Check your email'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            {step === 'email'
                                ? 'Sign in or create your Sindhi Namkeen account.'
                                : <>Enter the 6-digit code sent to <strong>{email}</strong>.</>}
                        </p>
                    </div>

                    {error && (
                        <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem' }}>
                            <AlertCircle size={18} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </div>
                    )}
                    {notice && <p role="status" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.1rem', textAlign: 'center' }}>{notice}</p>}

                    {step === 'email' ? (
                        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <div>
                                <label htmlFor="customer-email" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>Email address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        id="customer-email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        style={{ width: '100%', padding: '0.8rem 0.85rem 0.8rem 2.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '1rem', backgroundColor: 'var(--bg-cream)' }}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.85rem', width: '100%', fontSize: '1rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                <span>{loading ? 'Sending code...' : 'Send OTP'}</span>
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label htmlFor="customer-otp" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Verification code</label>
                            <input
                                id="customer-otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                required
                                aria-label="6-digit verification code"
                                placeholder="_ _ _ _ _ _"
                                value={otp}
                                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                style={{ width: '100%', boxSizing: 'border-box', padding: '0.9rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '1.35rem', fontWeight: 700, textAlign: 'center', letterSpacing: '0.45rem', backgroundColor: 'var(--bg-cream)' }}
                            />
                            <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary" style={{ padding: '0.85rem', width: '100%', fontSize: '1rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
                                <ArrowRight size={18} />
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.88rem' }}>
                                <button type="button" onClick={handleChangeEmail} disabled={loading} style={{ border: 0, padding: 0, background: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Change email</button>
                                <button type="button" onClick={sendCode} disabled={loading || countdown > 0} style={{ border: 0, padding: 0, background: 'none', color: countdown > 0 ? 'var(--text-muted)' : 'var(--primary)', fontWeight: 700, cursor: countdown > 0 ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                    {countdown > 0 && <Clock3 size={15} />}
                                    {countdown > 0 ? `Resend in ${formatCountdown}` : 'Resend OTP'}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CustomerOtpAuth;