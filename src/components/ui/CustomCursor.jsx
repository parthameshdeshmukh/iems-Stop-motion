import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);
  const isHoveredRef = useRef(false);
  const currentTextRef = useRef('');

  useEffect(() => {
    // Only enable custom cursor on non-touch desktop devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId;
    let isVisible = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (cursorRef.current) cursorRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }

      // Fast direct hardware transform (zero React re-render overhead)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Hover target detection with direct DOM manipulation (no setState)
      const target = e.target.closest('button, a, [data-cursor], canvas');
      const isTargetHovered = !!target;
      const hoverText = target ? (target.getAttribute('data-cursor') || '') : '';

      if (isTargetHovered !== isHoveredRef.current || hoverText !== currentTextRef.current) {
        isHoveredRef.current = isTargetHovered;
        currentTextRef.current = hoverText;

        if (ringRef.current) {
          if (isTargetHovered) {
            ringRef.current.style.width = '64px';
            ringRef.current.style.height = '64px';
            ringRef.current.style.marginLeft = '-32px';
            ringRef.current.style.marginTop = '-32px';
            ringRef.current.style.borderColor = 'rgba(255, 255, 255, 0.9)';
            ringRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          } else {
            ringRef.current.style.width = '40px';
            ringRef.current.style.height = '40px';
            ringRef.current.style.marginLeft = '-20px';
            ringRef.current.style.marginTop = '-20px';
            ringRef.current.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            ringRef.current.style.backgroundColor = 'transparent';
          }
        }

        if (textRef.current) {
          textRef.current.textContent = hoverText;
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Smooth lerp trailing ring loop
    const render = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Central Precision Reticle Dot */}
      <div
        ref={cursorRef}
        style={{ opacity: 0 }}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2.5 h-2.5 rounded-full bg-white pointer-events-none z-[100] transition-opacity duration-300 mix-blend-difference shadow-[0_0_10px_rgba(255,255,255,0.8)] will-change-transform"
      />

      {/* Outer Spring Ring & Contextual Badge */}
      <div
        ref={ringRef}
        style={{ opacity: 0, width: '40px', height: '40px', marginLeft: '-20px', marginTop: '-20px' }}
        className="fixed top-0 left-0 pointer-events-none z-[99] flex items-center justify-center transition-all duration-200 border border-white/40 mix-blend-difference rounded-full will-change-transform"
      >
        <span
          ref={textRef}
          className="font-mono-tech text-[8px] text-white font-bold tracking-widest uppercase text-center px-1 select-none"
        />
      </div>
    </>
  );
}
