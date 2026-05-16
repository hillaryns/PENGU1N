import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page auth-loading-screen">
        <div className="auth-spinner-wrap">
          <div className="auth-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (user.verified === false) {
    return (
      <Navigate
        to="/verify-email"
        replace
        state={{ email: user.email }}
      />
    );
  }

  return children;
}
