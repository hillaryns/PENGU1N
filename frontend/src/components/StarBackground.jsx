import { useEffect } from 'react';

export default function StarBackground({ shooting = false }) {
  useEffect(() => {
    if (!shooting) return undefined;

    const container = document.querySelector('.shooting-stars');
    if (!container) return undefined;

    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.top = `${Math.random() * 30}%`;
      star.style.left = `${Math.random() * 30}%`;
      container.appendChild(star);
      setTimeout(() => star.remove(), 1400);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.6) createShootingStar();
    }, 3000);

    return () => clearInterval(interval);
  }, [shooting]);

  return (
    <>
      <div className="stars" />
      {shooting && <div className="shooting-stars" />}
    </>
  );
}
