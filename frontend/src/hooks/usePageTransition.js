import { useNavigate } from 'react-router-dom';

export function usePageTransition() {
  const navigate = useNavigate();

  return (path) => {
    const transition = document.getElementById('page-transition');
    if (!transition) {
      navigate(path);
      return;
    }

    transition.classList.add('active');
    setTimeout(() => navigate(path), 2600);
  };
}
