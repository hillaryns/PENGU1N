import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import { api } from '../api/client';
import { passwordHints, passwordMeetsRules } from '../utils/passwordRules';
import { showToast } from '../utils/toast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, resetToken } = location.state || {};

  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!email || !resetToken) navigate('/forgot-password', { replace: true });
  }, [email, resetToken, navigate]);

  const hints = passwordHints(pw);

  const submit = async (e) => {
    e.preventDefault();
    if (!passwordMeetsRules(pw)) {
      showToast('Password does not meet strength requirements', 'error');
      return;
    }
    if (pw !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword({ email, resetToken, newPassword: pw, confirmPassword: confirm });
      setDone(true);
      showToast('Password updated');
      setTimeout(() => navigate('/signin', { replace: true }), 1600);
    } catch (err) {
      showToast(err.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !resetToken) return null;

  return (
    <div className="auth-page">
      <SmokeBackground />
      <PublicNavbar />
      <main className="page">
        <motion.div className="form-container auth-glass-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {done ? (
            <div className="verify-success">
              <div className="verify-success-icon">✓</div>
              <h1 className="form-title">Password updated</h1>
              <p className="form-subtitle">Redirecting to sign in...</p>
            </div>
          ) : (
            <>
              <div className="form-header">
                <h1 className="form-title">New password</h1>
                <p className="form-subtitle">Choose a strong password</p>
              </div>
              <ul className="password-rules-mini">
                <li className={hints.length ? 'ok' : ''}>8+ characters</li>
                <li className={hints.lower ? 'ok' : ''}>Lowercase</li>
                <li className={hints.upper ? 'ok' : ''}>Uppercase</li>
                <li className={hints.number ? 'ok' : ''}>Number</li>
                <li className={hints.special ? 'ok' : ''}>Special</li>
              </ul>
              <form onSubmit={submit}>
                <div className="form-group">
                  <label className="form-label">New password</label>
                  <div className="password-field-wrap">
                    <input
                      className="form-input"
                      type={show ? 'text' : 'password'}
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      required
                    />
                    <button type="button" className="password-toggle-eye" onClick={() => setShow((s) => !s)} aria-label="Toggle visibility">
                      <i className={`fas fa-eye${show ? '-slash' : ''}`} />
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm password</label>
                  <input
                    className="form-input"
                    type={show ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary form-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Update password'}
                </button>
              </form>
              <p className="form-footer"><Link to="/signin">Sign In</Link></p>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
