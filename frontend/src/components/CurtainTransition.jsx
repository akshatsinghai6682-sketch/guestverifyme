import React from 'react';
import { Sun, Moon } from 'lucide-react';

export function CurtainTransition({ isActive, targetTheme }) {
  if (!isActive) return null;

  return (
    <div
      className={`curtain-overlay is-animating ${targetTheme === 'light' ? 'to-light' : 'to-dark'}`}
      aria-hidden="true"
    >
      {/* Left Curtain Drape */}
      <div className="curtain-panel curtain-left">
        <div className="curtain-fabric-folds" />
        <div className="curtain-seam-glow" />
      </div>

      {/* Right Curtain Drape */}
      <div className="curtain-panel curtain-right">
        <div className="curtain-fabric-folds" />
        <div className="curtain-seam-glow" />
      </div>

      {/* Center Theatrical Reveal Badge */}
      <div className="curtain-badge-wrapper">
        <div className="curtain-badge">
          <div className="curtain-badge-icon">
            {targetTheme === 'light' ? (
              <Sun size={20} className="icon-sun" />
            ) : (
              <Moon size={20} className="icon-moon" />
            )}
          </div>
          <div className="curtain-badge-text">
            <span className="curtain-tag">GUESTVERIFY // THEME ENGINE</span>
            <span className="curtain-title">
              {targetTheme === 'light' ? 'DAYLIGHT PROTOCOL' : 'NIGHT OBSIDIAN PROTOCOL'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
