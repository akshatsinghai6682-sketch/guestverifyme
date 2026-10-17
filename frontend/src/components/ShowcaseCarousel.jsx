import React, { useState } from 'react';
import {
  Bell,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Radio,
  Package,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';
import { DemoScenarios } from './DemoScenarios.jsx';

export function ShowcaseCarousel({
  onSelectScenario,
  activeScenarioId,
  onRingBell,
  loading,
  onOpenRoster,
}) {
  const [activeSlide, setActiveSlide] = useState(0); // 0: Intercom Hero, 1: 3D Scenarios, 2: Security Roster

  const slides = [
    { id: 0, title: 'GuestVerify', subtitle: '(AI RESIDENCE GUARD)' },
    { id: 1, title: 'Tactile Scenarios', subtitle: '(3D ISOMETRIC PRESETS)' },
    { id: 2, title: 'Security Roster', subtitle: '(GROUND-TRUTH DISPATCH)' },
  ];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="sq-showcase-section">
      <div className="sq-showcase-container">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="sq-carousel-arrow arrow-left"
          aria-label="Previous showcase card"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="sq-carousel-arrow arrow-right"
          aria-label="Next showcase card"
        >
          <ChevronRight size={22} />
        </button>

        {/* The 3-Card Carousel Track */}
        <div className="sq-carousel-track">
          {/* Slide 0: GuestVerify Intercom Showcase (Centerpiece) */}
          <div
            className={`sq-showcase-card card-hero ${
              activeSlide === 0 ? 'is-active' : activeSlide > 0 ? 'is-prev' : 'is-next'
            }`}
            onClick={() => setActiveSlide(0)}
          >
            {/* Card Top Pill Navigation Bar */}
            <div className="sq-card-topbar">
              <div className="sq-card-brand-mark">
                <span className="dot dot-left" />
                <span className="dot dot-right" />
              </div>
              <div className="sq-card-pills">
                <span className="pill-item">1080P Stream</span>
                <span className="pill-item">Encrypted Audio</span>
                <span className="pill-item">IST Clock Active</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRingBell();
                  }}
                  disabled={loading}
                  className="pill-cta-btn"
                >
                  <span>{loading ? 'Evaluating...' : 'Ring Intercom'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Cinematic Hero Title */}
            <div className="sq-hero-card-content">
              <h1 className="sq-cinematic-title">
                GuestVerify <span className="sq-cinematic-subtitle">(AI RESIDENCE GUARD)</span>
              </h1>

              {/* Architectural Visual Center */}
              <div className="sq-cinematic-visual">
                <div className="sq-brutalist-block block-primary">
                  <div className="block-lens-iris">
                    <span className="lens-sensor" />
                  </div>
                  <span className="block-label">OPTICAL SENSOR</span>
                </div>
                <div className="sq-brutalist-block block-secondary">
                  <Radio size={20} className="pulse-cyan" />
                  <span className="block-label">AUDIO CONVERSE</span>
                </div>
              </div>
            </div>

            {/* Bottom Frosted Glass Bar */}
            <div className="sq-card-bottom-bar">
              <p className="bottom-bar-desc">
                Autonomous zero-trust access control designed to evaluate visitor intent, cross-verify scheduled deliveries, and prevent unauthorized intrusion.
              </p>
              <div className="bottom-bar-meta">
                <span className="meta-time">Monday – Sunday • 24/7 Active Protection</span>
                <span className="meta-loc">Residential Security Grid</span>
              </div>
            </div>
          </div>

          {/* Slide 1: 3D Tactile Scenarios (The 3D Isometric Buttons) */}
          <div
            className={`sq-showcase-card card-scenarios ${
              activeSlide === 1 ? 'is-active' : activeSlide > 1 ? 'is-prev' : 'is-next'
            }`}
            onClick={() => setActiveSlide(1)}
          >
            <div className="sq-card-topbar">
              <div className="sq-card-brand-mark">
                <Layers size={16} className="text-stone-300" />
              </div>
              <div className="sq-card-pills">
                <span className="pill-item">3D Tactile Slabs</span>
                <span className="pill-item">7 Presets</span>
                <span className="pill-item pill-highlight">1-Click Test</span>
              </div>
            </div>

            <div className="sq-scenarios-embed-wrap">
              <DemoScenarios
                onSelectScenario={onSelectScenario}
                activeScenarioId={activeScenarioId}
                disabled={loading}
              />
            </div>
          </div>

          {/* Slide 2: Security Roster & Deliveries */}
          <div
            className={`sq-showcase-card card-roster ${
              activeSlide === 2 ? 'is-active' : activeSlide > 2 ? 'is-prev' : 'is-next'
            }`}
            onClick={() => setActiveSlide(2)}
          >
            <div className="sq-card-topbar">
              <div className="sq-card-brand-mark">
                <Package size={16} className="text-stone-300" />
              </div>
              <div className="sq-card-pills">
                <span className="pill-item">Ground-Truth DB</span>
                <span className="pill-item">deliveries.json</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenRoster && onOpenRoster();
                  }}
                  className="pill-cta-btn"
                >
                  <span>Open Full Roster</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            <div className="sq-roster-preview-content">
              <h2 className="sq-cinematic-title">
                Security Roster <span className="sq-cinematic-subtitle">(GROUND TRUTH)</span>
              </h2>
              <div className="roster-preview-cards">
                <div className="roster-preview-item">
                  <div className="item-head">
                    <span className="pkg-carrier">Amazon Prime</span>
                    <span className="pkg-status active">ACTIVE WINDOW</span>
                  </div>
                  <p className="pkg-details">Recipient: John • Window: Today IST • ID: del-001</p>
                </div>
                <div className="roster-preview-item">
                  <div className="item-head">
                    <span className="pkg-carrier">FedEx Express</span>
                    <span className="pkg-status expired">EXPIRED (12:00)</span>
                  </div>
                  <p className="pkg-details">Recipient: John Smith • Rule 3 Overdue • ID: del-002</p>
                </div>
                <div className="roster-preview-item">
                  <div className="item-head">
                    <span className="pkg-carrier">Sarah Jenkins</span>
                    <span className="pkg-status trusted">PRE-APPROVED NEIGHBOR</span>
                  </div>
                  <p className="pkg-details">Registry #402 • Plant Watering • Front Gate Access</p>
                </div>
              </div>
            </div>

            <div className="sq-card-bottom-bar">
              <p className="bottom-bar-desc">
                Ground-truth database cross-referencing carrier tracking, delivery recipient names, and approved time windows before door release.
              </p>
              <div className="bottom-bar-meta">
                <span className="meta-time">Live Sync • Deterministic Evaluation</span>
                <span className="meta-loc">backend/data/deliveries.json</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="sq-carousel-indicators">
          {slides.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSlide(s.id)}
              className={`indicator-dot ${activeSlide === s.id ? 'is-active' : ''}`}
              title={s.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
