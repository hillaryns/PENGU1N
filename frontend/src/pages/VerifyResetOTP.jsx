import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import OtpInput from '../components/auth/OtpInput';
import { api } from '../api/client';
import { showToast } from '../utils/toast';

export default function VerifyResetOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

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
      const data = await api.verifyResetOtp({ email, otp });
      showToast('Code accepted');
      navigate('/reset-password', { state: { email, resetToken: data.resetToken } });
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
      await api.forgotPassword({ email });
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

  if (!email) return null;

  return (
    <div className="auth-page">
      <SmokeBackground />
      <PublicNavbar />
      <main className="page">
        <motion.div className="form-container auth-glass-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="form-header">
            <h1 className="form-title">Reset code</h1>
            <p className="form-subtitle">Enter the code sent to {email}</p>
          </div>
          <form onSubmit={submit}>
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />
            <button type="submit" className="btn btn-primary form-btn" disabled={loading || otp.length !== 6}>
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
          <div className="auth-verify-actions">
            <button type="button" className="btn btn-ghost" disabled={resendLoading || cooldown > 0} onClick={resend}>
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
            <Link to="/signin" className="btn btn-ghost">Cancel</Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
