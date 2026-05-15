import { useEffect } from 'react';

export function useHeroEffects() {
  useEffect(() => {
    const title = document.querySelector('.hero-title');
    if (!title) return undefined;

    const onMove = (e) => {
      const rect = title.getBoundingClientRect();
      const titleX = rect.left + rect.width / 2;
      const titleY = rect.top + rect.height / 2;
      const distX = e.clientX - titleX;
      const distY = e.clientY - titleY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      const maxDistance = 300;

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        title.style.transform = `translate(${distX * strength * 0.15}px, ${distY * strength * 0.15}px)`;
      } else {
        title.style.transform = 'translate(0, 0)';
      }
    };

    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const title = document.querySelector('.hero-title.edge-sparks');
    if (!title) return undefined;

    const interval = setInterval(() => {
      title.classList.add('spark-active');
      setTimeout(() => title.classList.remove('spark-active'), 200);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return undefined;

    for (let i = 0; i < 50; i += 1) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: rgba(99, 102, 241, ${Math.random() * 0.5});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
      `;
      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);
}
