import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sun, Moon } from 'lucide-react';

export function CurtainTransition({ isActive, targetTheme, onThemeSwitch, onAnimationComplete }) {
  const overlayRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const badgeRef = useRef(null);
  const seamLeftRef = useRef(null);
  const seamRightRef = useRef(null);

  useLayoutEffect(() => {
    if (!isActive) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onAnimationComplete) onAnimationComplete();
        },
      });

      // 1. Initial layout positions
      gsap.set(overlayRef.current, { autoAlpha: 1, display: 'block' });
      gsap.set(leftPanelRef.current, { xPercent: -100 });
      gsap.set(rightPanelRef.current, { xPercent: 100 });
      gsap.set(badgeRef.current, { scale: 0.4, opacity: 0, y: 30 });
      gsap.set([seamLeftRef.current, seamRightRef.current], { opacity: 0 });

      // 2. Curtains slide shut to meet at the center seam with power4 easing
      tl.to([leftPanelRef.current, rightPanelRef.current], {
        xPercent: 0,
        duration: 0.42,
        ease: 'power4.inOut',
      })
      // 3. Neon seam laser flash at contact point
      .to([seamLeftRef.current, seamRightRef.current], {
        opacity: 1,
        duration: 0.15,
        repeat: 1,
        yoyo: true,
      }, '-=0.18')
      // 4. Center badge pops in with elastic bounce
      .to(badgeRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'back.out(2)',
      }, '-=0.22')
      // 5. Flip the DOM theme at the exact center apex of the curtain closure!
      .add(() => {
        if (onThemeSwitch) onThemeSwitch();
      })
      // 6. Brief cinematic hold (120ms)
      .to({}, { duration: 0.12 })
      // 7. Center badge scales out
      .to(badgeRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.18,
        ease: 'power2.in',
      })
      // 8. Both curtains part open outwards with luxurious exponential ease
      .to(leftPanelRef.current, {
        xPercent: -100,
        duration: 0.48,
        ease: 'expo.out',
      })
      .to(rightPanelRef.current, {
        xPercent: 100,
        duration: 0.48,
        ease: 'expo.out',
      }, '<')
      // 9. Fade out overlay container
      .to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.12,
      }, '-=0.1');
    }, overlayRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <div
      ref={overlayRef}
      className={`curtain-overlay ${targetTheme === 'light' ? 'to-light' : 'to-dark'}`}
      style={{ display: isActive ? 'block' : 'none' }}
      aria-hidden="true"
    >
      {/* Left Curtain Drape */}
      <div ref={leftPanelRef} className="curtain-panel curtain-left">
        <div className="curtain-fabric-folds" />
        <div ref={seamLeftRef} className="curtain-seam-glow" />
      </div>

      {/* Right Curtain Drape */}
      <div ref={rightPanelRef} className="curtain-panel curtain-right">
        <div className="curtain-fabric-folds" />
        <div ref={seamRightRef} className="curtain-seam-glow" />
      </div>

      {/* Center Theatrical Reveal Badge */}
      <div className="curtain-badge-wrapper">
        <div ref={badgeRef} className="curtain-badge">
          <div className="curtain-badge-icon">
            {targetTheme === 'light' ? (
              <Sun size={20} className="icon-sun text-amber" />
            ) : (
              <Moon size={20} className="icon-moon text-cyan" />
            )}
          </div>
          <div className="curtain-badge-text">
            <span className="curtain-tag">GUESTVERIFY // GSAP THEME ENGINE</span>
            <span className="curtain-title">
              {targetTheme === 'light' ? 'DAYLIGHT PROTOCOL' : 'NIGHT OBSIDIAN PROTOCOL'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
