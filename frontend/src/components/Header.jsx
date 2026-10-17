import React from 'react';
import { Volume2, VolumeX, Cpu, Radio, ChevronDown, Sun, Moon, Shield } from 'lucide-react';

export function Header({
  aiMode,
  speechEnabled,
  setSpeechEnabled,
  currentTime,
  activeTab = 'intercom',
  onTabClick,
  onRingBell,
  theme = 'dark',
  onToggleTheme,
}) {
  const isBedrock = aiMode === 'bedrock';
  const isLight = theme === 'light';

  return (
    <header className="orchid-header">
      <div className="orchid-header-inner">
        {/* Left Section: Brand & Nav Links */}
        <div className="orchid-header-left">
          {/* Brand Logo with 8-Petal Security Aperture Mark */}
          <div className="orchid-brand" onClick={() => onTabClick && onTabClick('intercom')}>
            <div className="orchid-logo-symbol">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 8-Petal Biometric Aperture Icon inspired by Orchid */}
                <circle cx="12" cy="12" r="3.2" fill="currentColor" />
                <ellipse cx="12" cy="4.5" rx="2" ry="3.5" fill="currentColor" />
                <ellipse cx="12" cy="19.5" rx="2" ry="3.5" fill="currentColor" />
                <ellipse cx="4.5" cy="12" rx="3.5" ry="2" fill="currentColor" />
                <ellipse cx="19.5" cy="12" rx="3.5" ry="2" fill="currentColor" />
                <ellipse cx="6.7" cy="6.7" rx="3.2" ry="1.9" transform="rotate(-45 6.7 6.7)" fill="currentColor" />
                <ellipse cx="17.3" cy="17.3" rx="3.2" ry="1.9" transform="rotate(-45 17.3 17.3)" fill="currentColor" />
                <ellipse cx="17.3" cy="6.7" rx="3.2" ry="1.9" transform="rotate(45 17.3 6.7)" fill="currentColor" />
                <ellipse cx="6.7" cy="17.3" rx="3.2" ry="1.9" transform="rotate(45 6.7 17.3)" fill="currentColor" />
              </svg>
            </div>
            <span className="orchid-brand-title">GuestVerify</span>
          </div>

          {/* Navigation Links with Orchid-style Capsule Active Pill */}
          <nav className="orchid-nav">
            <button
              type="button"
              onClick={() => onTabClick && onTabClick('intercom')}
              className={`orchid-nav-capsule ${activeTab === 'intercom' ? 'is-active' : ''}`}
              title="Autonomous Intercom Console"
            >
              <span>Intercom</span>
              <ChevronDown size={13} className="orchid-chevron" />
            </button>

            <button
              type="button"
              onClick={() => onTabClick && onTabClick('roster')}
              className={`orchid-nav-link ${activeTab === 'roster' ? 'is-active' : ''}`}
              title="Expected Deliveries & Visitors Ledger"
            >
              <span>Security Roster</span>
            </button>

            <button
              type="button"
              onClick={() => onTabClick && onTabClick('audit')}
              className={`orchid-nav-link ${activeTab === 'audit' ? 'is-active' : ''}`}
              title="Cryptographic Decision Audit Ledger"
            >
              <span>Decision Audit</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Controls, Curtain Theme Switch, Login, Book a Call / CTA */}
        <div className="orchid-header-right">
          {/* Live IST Clock */}
          <div className="orchid-clock-pill" title="Live IST Timestamp">
            <Radio size={12} className="orchid-pulse-dot" />
            <span>{currentTime || 'IST ACTIVE'}</span>
          </div>

          {/* Speaker Speech Toggle */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`orchid-icon-btn ${speechEnabled ? 'is-active' : ''}`}
            title={speechEnabled ? 'Mute Intercom Speaker' : 'Enable Intercom Speaker'}
            type="button"
          >
            {speechEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* AI Engine Status Pill */}
          <div className={`orchid-ai-pill ${isBedrock ? 'is-bedrock' : 'is-mock'}`}>
            <Cpu size={12} />
            <span>{isBedrock ? 'Bedrock' : 'Mock AI'}</span>
          </div>

          {/* Curtain Effect Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="orchid-curtain-toggle-btn"
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode (Curtain Transition)`}
          >
            <span className="curtain-toggle-icon">
              {isLight ? <Moon size={14} /> : <Sun size={14} />}
            </span>
            <span className="curtain-toggle-label">{isLight ? 'Dark' : 'Light'}</span>
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={() => onTabClick && onTabClick('roster')}
            className="orchid-login-btn"
          >
            Login
          </button>

          {/* Book a Call / Get Started Pill Button */}
          <button
            type="button"
            onClick={() => {
              if (onRingBell) {
                onRingBell();
              } else {
                document.getElementById('intercom-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="orchid-cta-btn"
          >
            Book a call
          </button>
        </div>
      </div>
    </header>
  );
}
