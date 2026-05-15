import { Link } from 'react-router-dom';
import { TRANSITION_PATHS, usePageTransition } from '../context/PageTransitionContext';

/**
 * React Router link that plays the penguin loading transition for auth routes.
 */
export default function TransitionLink({ to, onClick, children, ...props }) {
  const runTransition = usePageTransition();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    if (TRANSITION_PATHS.has(to)) {
      e.preventDefault();
      runTransition(to);
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
