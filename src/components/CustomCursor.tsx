import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface CustomCursorProps {
  enabled: boolean;
}

export default function CustomCursor({ enabled }: CustomCursorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Mouse positions using motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring settings for ultra-smooth buttery lag effect (luxury design)
  const springConfig = { damping: 35, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Create separate top-level motion values and springs for the precise inner dot to avoid inline hooks
  const dotXVal = useMotionValue(-100);
  const dotYVal = useMotionValue(-100);
  const dotX = useSpring(dotXVal, springConfig);
  const dotY = useSpring(dotYVal, springConfig);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16); // Center offset for 32px diameter ring
      mouseY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Scale up when hovering buttons, links, or clickable items
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('clickable')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;
  if (isMobile) return null;

  return (
    <>
      {/* Outer cinematic fluid ring with interactive scale transitions */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/40 pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isClicked ? 0.75 : (isHovered ? 1.6 : 1),
          borderColor: isClicked ? 'rgba(255, 255, 255, 0.8)' : (isHovered ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)'),
        }}
        animate={{
          rotate: isHovered ? 90 : 0
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      />
      {/* Inner precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          scale: isClicked ? 1.5 : 1,
        }}
        ref={(el) => {
          if (el) {
            const updateDot = () => {
              el.style.transform = `translate3d(${mouseX.get() + 12}px, ${mouseY.get() + 12}px, 0)`;
              requestAnimationFrame(updateDot);
            };
            requestAnimationFrame(updateDot);
          }
        }}
      />
    </>
  );
}
