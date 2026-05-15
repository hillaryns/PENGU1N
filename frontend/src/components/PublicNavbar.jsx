import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TransitionLink from './TransitionLink';

export default function PublicNavbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            PENGU1N
          </Link>
          <div className="nav-links">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/subjects">Subjects</NavLink>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <TransitionLink to="/signin" className="btn btn-ghost">
                  Sign In
                </TransitionLink>
                <TransitionLink to="/signup" className="btn btn-primary">
                  Sign Up
                </TransitionLink>
              </>
            )}
          </div>
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <Link to="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>
        <Link to="/subjects" onClick={() => setMenuOpen(false)}>
          Subjects
        </Link>
        {user ? (
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
        ) : (
          <>
            <TransitionLink to="/signin" onClick={() => setMenuOpen(false)}>
              Sign In
            </TransitionLink>
            <TransitionLink to="/signup" onClick={() => setMenuOpen(false)}>
              Sign Up
            </TransitionLink>
          </>
        )}
      </div>
    </>
  );
}
