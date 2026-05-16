import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransitionLink from '../components/TransitionLink';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import { passwordHints, USERNAME_HINT } from '../utils/passwordRules';
import { readSignupForm, validateSignupClient } from '../utils/signupValidation';

const EMPTY_ERRORS = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  form: '',
};

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState(EMPTY_ERRORS);

  const hints = passwordHints(password);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  };

  const applyServerErrors = (err) => {
    const serverErrors = err.data?.errors;
    if (serverErrors && typeof serverErrors === 'object') {
      setFieldErrors((prev) => ({
        ...prev,
        ...serverErrors,
        form: err.message || '',
      }));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, form: err.message || 'Signup failed' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stateSnapshot = { username, email, password, confirmPassword };
    const fields = readSignupForm(e.currentTarget, stateSnapshot);
    console.log('[signup] submit state', stateSnapshot);
    console.log('[signup] submit merged', fields);

    setUsername(fields.username);
    setEmail(fields.email);
    setPassword(fields.password);
    setConfirmPassword(fields.confirmPassword);

    const clientErrors = validateSignupClient(fields);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors({ ...EMPTY_ERRORS, ...clientErrors });
      const first = Object.values(clientErrors)[0];
      showToast(first, 'error');
      return;
    }

    setFieldErrors(EMPTY_ERRORS);
    setLoading(true);
    try {
      const data = await signup(fields);
      if (data.needsVerification) {
        showToast('Check your email for a verification code');
        navigate('/verify-email', { replace: true, state: { email: data.email } });
      }
    } catch (error) {
      applyServerErrors(error);
      showToast(error.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <SmokeBackground />
      <PublicNavbar />
      <main className="page">
        <div className="form-container auth-glass-panel auth-signup-wide">
          <div className="form-header">
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Verify your email to unlock the dashboard</p>
          </div>
          <form id="signupForm" onSubmit={handleSubmit} noValidate>
            {fieldErrors.form ? <p className="field-error field-error-form">{fieldErrors.form}</p> : null}
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-input${fieldErrors.username ? ' input-invalid' : ''}`}
                placeholder="halcyon"
                value={username}
                onChange={(ev) => {
                  setUsername(ev.target.value);
                  clearFieldError('username');
                }}
                onInput={(ev) => setUsername(ev.target.value)}
                autoComplete="username"
              />
              {fieldErrors.username ? <p className="field-error">{fieldErrors.username}</p> : null}
              <span className="field-hint">{USERNAME_HINT}</span>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input${fieldErrors.email ? ' input-invalid' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                  clearFieldError('email');
                }}
                onInput={(ev) => setEmail(ev.target.value)}
                autoComplete="email"
              />
              {fieldErrors.email ? <p className="field-error">{fieldErrors.email}</p> : null}
            </div>
            <div className="form-group">
              <label className="form-label">Password strength</label>
              <ul className="password-rules-mini">
                <li className={hints.length ? 'ok' : ''}>8+ characters</li>
                <li className={hints.lower ? 'ok' : ''}>Lowercase</li>
                <li className={hints.upper ? 'ok' : ''}>Uppercase</li>
                <li className={hints.number ? 'ok' : ''}>Number</li>
                <li className={hints.special ? 'ok' : ''}>Special</li>
              </ul>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="password-field-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className={`form-input${fieldErrors.password ? ' input-invalid' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(ev) => {
                    setPassword(ev.target.value);
                    clearFieldError('password');
                  }}
                  onInput={(ev) => setPassword(ev.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="password-toggle-eye" tabIndex={-1} onClick={() => setShowPw((s) => !s)} aria-label="Show password">
                  <i className={`fas fa-eye${showPw ? '-slash' : ''}`} />
                </button>
              </div>
              {fieldErrors.password ? <p className="field-error">{fieldErrors.password}</p> : null}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
              <input
                type={showPw ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input${fieldErrors.confirmPassword ? ' input-invalid' : ''}`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(ev) => {
                  setConfirmPassword(ev.target.value);
                  clearFieldError('confirmPassword');
                }}
                onInput={(ev) => setConfirmPassword(ev.target.value)}
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword ? <p className="field-error">{fieldErrors.confirmPassword}</p> : null}
            </div>
            <button type="submit" className="btn btn-primary form-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="form-footer">
            Already have an account? <TransitionLink to="/signin">Sign In</TransitionLink>
          </p>
        </div>
      </main>
    </div>
  );
}
