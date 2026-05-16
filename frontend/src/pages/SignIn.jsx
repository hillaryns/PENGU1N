import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TransitionLink from '../components/TransitionLink';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../context/PageTransitionContext';
import { showToast } from '../utils/toast';

export default function SignIn() {
  const { login } = useAuth();
  const runTransition = usePageTransition();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(identifier.trim(), password);
      showToast('Login successful');
      if (user.verified === false) {
        navigate('/verify-email', { replace: true, state: { email: user.email } });
      } else {
        runTransition('/dashboard');
      }
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <SmokeBackground />
      <PublicNavbar />
      <main className="page">
        <div className="form-container auth-glass-panel">
          <div className="form-header">
            <h1 className="form-title">Welcome Back</h1>
            <p className="form-subtitle">Sign in to continue learning</p>
          </div>
          <form id="signinForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="identifier">Username or Email</label>
              <input
                type="text"
                id="identifier"
                className="form-input"
                placeholder="halcyon or you@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="password-field-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="password-toggle-eye" tabIndex={-1} onClick={() => setShowPw((s) => !s)} aria-label="Show password">
                  <i className={`fas fa-eye${showPw ? '-slash' : ''}`} />
                </button>
              </div>
            </div>
            <div className="auth-links-row">
              <Link to="/forgot-password" className="auth-inline-link">Forgot Password?</Link>
              <Link to="/forgot-email" className="auth-inline-link">Forgot Email?</Link>
            </div>
            <button type="submit" className="btn btn-primary form-btn" disabled={loading}>
              {loading ? <span className="auth-btn-loading"><span className="auth-spinner tiny" aria-hidden /> Signing in...</span> : 'Sign In'}
            </button>
          </form>
          <p className="form-footer">
            Don&apos;t have an account? <TransitionLink to="/signup">Sign Up</TransitionLink>
          </p>
        </div>
      </main>
    </div>
  );
}
