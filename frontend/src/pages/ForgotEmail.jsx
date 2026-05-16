import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import { api } from '../api/client';
import { showToast } from '../utils/toast';

export default function ForgotEmail() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = username.trim().toLowerCase();
      await api.forgotEmailRequest({ username: u });
      showToast('If an account exists, a code was sent.');
      navigate('/verify-email-recovery', { state: { username: u } });
    } catch (err) {
      showToast(err.message || 'Request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <SmokeBackground />
      <PublicNavbar />
      <main className="page">
        <motion.div className="form-container auth-glass-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="form-header">
            <h1 className="form-title">Forgot Email</h1>
            <p className="form-subtitle">Enter your username — we&apos;ll email a recovery code</p>
          </div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label" htmlFor="fe-user">Username</label>
              <input
                id="fe-user"
                className="form-input"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary form-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send code'}
            </button>
          </form>
          <p className="form-footer"><Link to="/signin">Back to Sign In</Link></p>
        </motion.div>
      </main>
    </div>
  );
}
