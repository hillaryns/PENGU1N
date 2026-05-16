import { createContext, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const PageTransitionContext = createContext(null);

export const TRANSITION_DURATION_MS = 2600;

export const TRANSITION_PATHS = new Set(['/signin', '/signup']);

function spawnStars(container) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 40; i += 1) {
    const star = document.createElement('span');
    star.style.left = `${Math.random() * window.innerWidth}px`;
    star.style.top = `${Math.random() * window.innerHeight}px`;
    container.appendChild(star);
  }
}

export function PageTransitionProvider({ children }) {
  const navigate = useNavigate();

  const runTransition = useCallback(
    (path) => {
      const transition = document.getElementById('page-transition');
      if (!transition) {
        navigate(path);
        return;
      }

      const starContainer = transition.querySelector('.blackhole-stars');
      spawnStars(starContainer);

      document.body.classList.add('page-transitioning');

      transition.classList.remove('active', 'fade-out');
      void transition.offsetWidth;
      transition.classList.add('active');

      window.setTimeout(() => {
        navigate(path);
        window.requestAnimationFrame(() => {
          transition.classList.add('fade-out');
          transition.classList.remove('active');
          window.setTimeout(() => {
            transition.classList.remove('fade-out');
            document.body.classList.remove('page-transitioning');
            if (starContainer) starContainer.innerHTML = '';
          }, 450);
        });
      }, TRANSITION_DURATION_MS);
    },
    [navigate],
  );

  return (
    <PageTransitionContext.Provider value={{ runTransition }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within PageTransitionProvider');
  }
  return context.runTransition;
}
