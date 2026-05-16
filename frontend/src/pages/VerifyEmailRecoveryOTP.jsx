import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import OtpInput from '../components/auth/OtpInput';
import { api } from '../api/client';
import { showToast } from '../utils/toast';

export default function VerifyEmailRecoveryOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [fullEmail, setFullEmail] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!username) navigate('/forgot-email', { replace: true });
  }, [username, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const submit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const data = await api.forgotEmailVerify({ username, otp });
      setMaskedEmail(data.maskedEmail);
      setFullEmail(data.email);
      setTimeout(() => setRevealed(true), 600);
      showToast('Verified');
    } catch (err) {
      showToast(err.message || 'Invalid code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setResendLoading(true);
    try {
      await api.forgotEmailRequest({ username });
      showToast('Code resent');
      setCooldown(60);
    } catch (err) {
      const sec = err.data?.cooldownSeconds;
      if (sec) setCooldown(sec);
      showToast(err.message || 'Could not resend', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  if (!username) return null;

  return (
    <div className="auth-page">
      <SmokeBackground />
      <PublicNavbar />
      <main className="page">
        <motion.div className="form-container auth-glass-panel" layout>
          {!maskedEmail ? (
            <>
              <div className="form-header">
                <h1 className="form-title">Recovery code</h1>
                <p className="form-subtitle">Check the inbox for username <strong>{username}</strong></p>
              </div>
              <form onSubmit={submit}>
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                <button type="submit" className="btn btn-primary form-btn" disabled={loading || otp.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </form>
              <div className="auth-verify-actions">
                <button type="button" className="btn btn-ghost" disabled={resendLoading || cooldown > 0} onClick={resend}>
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
                <Link to="/signin" className="btn btn-ghost">Cancel</Link>
              </div>
            </>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="reveal"
                className="email-reveal-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="form-title">Your email</h2>
                <motion.p
                  className="masked-email-line"
                  animate={{ opacity: revealed ? 0.5 : 1 }}
                >
                  {maskedEmail}
                </motion.p>
                {revealed && (
                  <motion.p
                    className="full-email-line"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {fullEmail}
                  </motion.p>
                )}
                <Link to="/signin" className="btn btn-primary form-btn">Sign In</Link>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </main>
    </div>
  );
}
