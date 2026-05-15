import { useState } from 'react';
import TransitionLink from '../components/TransitionLink';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import { useAuth } from '../context/AuthContext';
import { usePageTransition } from '../context/PageTransitionContext';
import { showToast } from '../utils/toast';

export default function SignUp() {
  const { signup } = useAuth();
  const runTransition = usePageTransition();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signup(name, email, password);
      showToast(`Welcome, ${user.name}!`);
      runTransition('/dashboard');
    } catch (error) {
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
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Start your learning journey today</p>
          </div>
          <form id="signupForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
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
