import React from 'react';
import { ShieldCheck, Volume2, VolumeX, Cpu, Radio, Shield } from 'lucide-react';

export function Header({ aiMode, speechEnabled, setSpeechEnabled, currentTime }) {
  const isBedrock = aiMode === 'bedrock';

  return (
    <header className="sq-header">
      <div className="sq-header-inner">
        {/* Brand Logo */}
        <div className="sq-brand">
          <div className="sq-logo-mark">
            <ShieldCheck size={22} className="sq-logo-icon" />
          </div>
          <div className="sq-brand-text">
            <span className="sq-brand-name">GUESTVERIFY</span>
            <span className="sq-brand-badge">PRO GUARD</span>
          </div>
        </div>

        {/* Center Editorial Links */}
        <nav className="sq-nav-links">
          <span className="sq-nav-item active">INTERCOM STREAM</span>
          <span className="sq-nav-item">SECURITY ROSTER</span>
          <span className="sq-nav-item">DECISION AUDIT</span>
        </nav>

        {/* Right Actions */}
        <div className="sq-header-actions">
          {/* Live IST Clock */}
          <div className="sq-clock-pill">
            <Radio size={13} className="text-cyan pulse-icon" />
            <span>{currentTime || 'IST ACTIVE'}</span>
          </div>

          {/* 3D Speaker Button */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`btn-3d btn-3d-secondary ${speechEnabled ? 'is-active' : ''}`}
            title={speechEnabled ? 'Mute Intercom Speaker' : 'Enable Intercom Speaker'}
            type="button"
          >
            {speechEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{speechEnabled ? 'SPEAKER ON' : 'MUTED'}</span>
          </button>

          {/* 3D Mode Pill */}
          <div className={`btn-3d sq-mode-btn ${isBedrock ? 'btn-3d-purple' : 'btn-3d-emerald'}`}>
            <Cpu size={14} />
            <span>{isBedrock ? 'BEDROCK AI' : 'MOCK AI'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
