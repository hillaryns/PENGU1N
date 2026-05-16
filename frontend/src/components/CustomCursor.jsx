import { useEffect, useRef, useState } from 'react';

const INTERACTIVE = 'a, button, .card, .subject-card, .course-card, .test-card, .video-card, .stat-card, .sidebar-link, .btn, input, textarea, select, .quiz-option';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduced) return undefined;

    setEnabled(true);
    document.body.classList.add('custom-cursor-active');

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      velocity.current = {
        x: e.clientX - current.current.x,
        y: e.clientY - current.current.y,
      };
      if (!visible) setVisible(true);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e) => {
      if (e.target.closest(INTERACTIVE)) setHovering(true);
    };
    const onOut = (e) => {
      if (e.target.closest(INTERACTIVE)) setHovering(false);
    };

    const tick = () => {
      const dotLerp = hovering ? 0.55 : 0.72;
      const ringLerp = hovering ? 0.2 : 0.35;

      current.current.x += (target.current.x - current.current.x) * dotLerp;
      current.current.y += (target.current.y - current.current.y) * dotLerp;
      ringPos.current.x += (target.current.x - ringPos.current.x) * ringLerp;
      ringPos.current.y += (target.current.y - ringPos.current.y) * ringLerp;

      const speed = Math.hypot(velocity.current.x, velocity.current.y);
      const stretch = Math.min(speed * 0.08, 1.4);
      const angle = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI);

      const dotScale = clicking ? 0.75 : hovering ? 1.6 : 1;
      const ringScale = clicking ? 1.15 : hovering ? 2.1 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%) scale(${dotScale})`;
        dotRef.current.style.opacity = visible ? '1' : '0';
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${ringScale}) scaleX(${1 + stretch * 0.15}) rotate(${angle}deg)`;
        ringRef.current.style.opacity = visible ? (hovering ? '0.95' : '0.5') : '0';
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
        trailRef.current.style.opacity = visible ? String(Math.min(0.35, speed * 0.02)) : '0';
      }

      velocity.current.x *= 0.85;
      velocity.current.y *= 0.85;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [hovering, visible, clicking]);

  if (!enabled) return null;

  return (
    <>
      <div ref={trailRef} className="custom-cursor-trail" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
}
