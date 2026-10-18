import React, { useState } from 'react';
import { Volume2, VolumeX, Cpu, Radio, ChevronDown, Sun, Moon, Shield, Menu, X, Bell } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isBedrock = aiMode === 'bedrock';
  const isLight = theme === 'light';

  const handleMobileNavClick = (tab) => {
    setIsMobileMenuOpen(false);
    if (onTabClick) {
      onTabClick(tab);
    }
  };

  const handleMobileCta = () => {
    setIsMobileMenuOpen(false);
    if (onRingBell) {
      onRingBell();
    } else {
      document.getElementById('intercom-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="orchid-header">
      <div className="orchid-header-inner">
        {/* Left Section: Brand & Nav Links */}
        <div className="orchid-header-left">
          {/* Brand Logo with 8-Petal Security Aperture Mark */}
          <div className="orchid-brand" onClick={() => handleMobileNavClick('intercom')}>
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

          {/* Desktop Navigation Links with Orchid-style Capsule Active Pill */}
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
          {/* Live IST Clock (Desktop only) */}
          <div className="orchid-clock-pill desktop-only" title="Live IST Timestamp">
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

          {/* AI Engine Status Pill (Desktop only) */}
          <div className={`orchid-ai-pill desktop-only ${isBedrock ? 'is-bedrock' : 'is-mock'}`}>
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

          {/* Login Button (Desktop only) */}
          <button
            type="button"
            onClick={() => onTabClick && onTabClick('roster')}
            className="orchid-login-btn desktop-only"
          >
            Login
          </button>

          {/* Book a Call / Get Started Pill Button (Desktop only) */}
          <button
            type="button"
            onClick={() => {
              if (onRingBell) {
                onRingBell();
              } else {
                document.getElementById('intercom-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="orchid-cta-btn desktop-only"
          >
            Book a call
          </button>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            className="orchid-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            title="Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Overlay */}
      {isMobileMenuOpen && (
        <div className="orchid-mobile-drawer">
          <div className="mobile-drawer-nav">
            <button
              type="button"
              onClick={() => handleMobileNavClick('intercom')}
              className={`mobile-drawer-link ${activeTab === 'intercom' ? 'is-active' : ''}`}
            >
              <span>Intercom Console</span>
              <span className="mobile-drawer-badge">LIVE 1080P</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileNavClick('roster')}
              className={`mobile-drawer-link ${activeTab === 'roster' ? 'is-active' : ''}`}
            >
              <span>Security Roster</span>
              <span className="mobile-drawer-badge">GROUND-TRUTH</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileNavClick('audit')}
              className={`mobile-drawer-link ${activeTab === 'audit' ? 'is-active' : ''}`}
            >
              <span>Decision Audit Log</span>
              <span className="mobile-drawer-badge">AUDIT</span>
            </button>
          </div>

          <div className="mobile-drawer-meta">
            <div className="mobile-meta-row">
              <span className="mobile-meta-label">TIME</span>
              <div className="orchid-clock-pill mobile-clock-pill">
                <Radio size={12} className="orchid-pulse-dot" />
                <span>{currentTime || 'IST ACTIVE'}</span>
              </div>
            </div>

            <div className="mobile-meta-row">
              <span className="mobile-meta-label">AI ENGINE</span>
              <div className={`orchid-ai-pill ${isBedrock ? 'is-bedrock' : 'is-mock'}`}>
                <Cpu size={12} />
                <span>{isBedrock ? 'Bedrock AI' : 'Mock Engine'}</span>
              </div>
            </div>
          </div>

          <div className="mobile-drawer-actions">
            <button
              type="button"
              onClick={handleMobileCta}
              className="btn-3d btn-3d-primary mobile-cta-btn"
            >
              <Bell size={16} />
              <span>RING DOORBELL</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
