import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import OtpInput from '../components/auth/OtpInput';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../context/PageTransitionContext';
import { showToast } from '../utils/toast';

export default function VerifyEmail() {
  const { user, verifyEmail, resendVerification, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const runTransition = usePageTransition();

  const email =
    location.state?.email ||
    user?.email ||
    new URLSearchParams(location.search).get('email') ||
    '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.verified) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || !email) {
      showToast('Enter the full 6-digit code', 'error');
      return;
    }
    setLoading(true);
    try {
      await verifyEmail(email, otp);
      setSuccess(true);
      showToast('Email verified!');
      setTimeout(() => runTransition('/dashboard'), 1200);
    } catch (err) {
      showToast(err.message || 'Invalid code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResendLoading(true);
    try {
      await resendVerification(email);
      showToast('New code sent');
      setCooldown(60);
    } catch (err) {
      const sec = err.data?.cooldownSeconds;
      if (sec) setCooldown(sec);
      showToast(err.message || 'Could not resend', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="auth-page">
        <SmokeBackground />
        <PublicNavbar />
        <main className="page">
          <div className="form-container auth-glass-panel">
            <p className="form-subtitle">No email to verify. Sign up or sign in again.</p>
            <Link to="/signup" className="btn btn-primary form-btn">Sign Up</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <SmokeBackground />
      <PublicNavbar />
      <main className="page">
        <motion.div
          className="form-container auth-glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="ok"
                className="verify-success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="verify-success-icon">✓</div>
                <h1 className="form-title">Verified</h1>
                <p className="form-subtitle">Opening your dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }}>
                <div className="form-header">
                  <h1 className="form-title">Verify Email</h1>
                  <p className="form-subtitle">
                    Enter the code sent to <strong>{email}</strong>
                  </p>
                </div>
                <form onSubmit={handleVerify}>
                  <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                  <motion.button
                    type="submit"
                    className="btn btn-primary form-btn"
                    disabled={loading || otp.length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? <span className="auth-btn-loading"><span className="auth-spinner tiny" aria-hidden /> Verifying...</span> : 'Verify'}
                  </motion.button>
                </form>
                <div className="auth-verify-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={resendLoading || cooldown > 0}
                    onClick={handleResend}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => { logout({ silent: true }); navigate('/signin'); }}>
                    Use different account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
