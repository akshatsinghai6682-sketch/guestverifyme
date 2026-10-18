import React from 'react';
import {
  ShieldCheck,
  HelpCircle,
  ShieldAlert,
  Volume2,
  Cpu,
  Package,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
} from 'lucide-react';

export function ResultCard({ result, loading }) {
  if (loading) {
    return (
      <div className="sq-card sq-card-result is-evaluating">
        <div className="sq-evaluating-radar">
          <span className="evaluating-ring" />
          <Cpu size={28} className="text-cyan animate-spin" />
        </div>
        <h3 className="evaluating-title">Analyzing Visitor Statement...</h3>
        <p className="evaluating-subtitle">
          Running Bedrock/Mock AI Converse verification and deterministic safety rules.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="sq-card sq-card-result is-empty">
        <div className="sq-card-header">
          <div className="sq-card-title-group">
            <div className="sq-card-identity">
              <span className="sq-terminal-tag">ENFORCEMENT ENGINE</span>
              <h2 className="sq-card-title">Verdict & Enforcement</h2>
              <p className="sq-card-subtitle">Zero-Trust Physical Access Evaluation</p>
            </div>
          </div>
          <span className="sq-status-pill pill-standby">STANDBY</span>
        </div>
        <div className="sq-empty-state-body">
          <div className="sq-empty-radar-wrap">
            <Radio size={28} className="text-cyan animate-pulse" />
          </div>
          <p className="sq-empty-text">Awaiting Intercom Verification</p>
          <p className="sq-empty-hint">
            Press the 3D doorbell button or select a simulation switch above to trigger the zero-trust evaluation engine.
          </p>
          <div className="sq-active-rules-list">
            <span className="rule-chip">✓ RULE 1: Ground-Truth Schedule</span>
            <span className="rule-chip">✓ RULE 2: Resident Match</span>
            <span className="rule-chip">✓ RULE 3: Window Lock</span>
            <span className="rule-chip">✓ RULE 5: Injection Shield</span>
          </div>
        </div>
      </div>
    );
  }

  const {
    verdict,
    confidence,
    matched_delivery_id,
    reasoning,
    reply_to_visitor,
    follow_up_question,
    action_taken,
    safety_interventions = [],
    round,
  } = result;

  const badgeConfig = {
    AUTHORIZED: {
      label: 'AUTHORIZED',
      icon: ShieldCheck,
      cardClass: 'verdict-theme-authorized',
      pillClass: 'btn-3d-verdict-emerald',
      actionIcon: Unlock,
      actionText: matched_delivery_id ? 'Package Drop Approved' : 'Visitor Access Granted',
    },
    NEEDS_MORE_INFO: {
      label: 'NEEDS MORE INFO',
      icon: HelpCircle,
      cardClass: 'verdict-theme-needs-info',
      pillClass: 'btn-3d-verdict-amber',
      actionIcon: Lock,
      actionText: `Inquiry Round ${round}/2`,
    },
    SUSPICIOUS: {
      label: 'ACCESS DENIED: SUSPICIOUS',
      icon: ShieldAlert,
      cardClass: 'verdict-theme-suspicious',
      pillClass: 'btn-3d-verdict-crimson',
      actionIcon: Lock,
      actionText: 'Access Denied • Owner Alerted',
    },
  }[verdict] || {
    label: verdict,
    icon: HelpCircle,
    cardClass: 'verdict-theme-needs-info',
    pillClass: 'btn-3d-verdict-amber',
    actionIcon: Lock,
    actionText: action_taken,
  };

  const VerdictIcon = badgeConfig.icon;
  const ActionIcon = badgeConfig.actionIcon;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className={`sq-card sq-card-result ${badgeConfig.cardClass}`}>
      {/* Architectural Card Header */}
      <div className="sq-card-header">
        <div className="sq-card-title-group">
          <div className="sq-card-identity">
            <span className="sq-terminal-tag">SECURITY ENFORCEMENT</span>
            <h2 className="sq-card-title">Verdict & Enforcement</h2>
            <p className="sq-card-subtitle">Autonomous Security Decision</p>
          </div>
        </div>

        {/* 3D Tactile Verdict Pill */}
        <div className={`btn-3d ${badgeConfig.pillClass}`}>
          <VerdictIcon size={18} />
          <span>{badgeConfig.label}</span>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="sq-confidence-box">
        <div className="sq-confidence-labels">
          <span className="sq-confidence-tag">AI CONFIDENCE SCORE</span>
          <span className="sq-confidence-val">{confidencePercent}%</span>
        </div>
        <div className="sq-confidence-track">
          <div
            className="sq-confidence-bar"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Editorial Spoken Reply Quote */}
      <div className="sq-spoken-quote-box">
        <div className="sq-box-heading">
          <Volume2 size={15} className="text-cyan" />
          <span>ANNOUNCED VIA DOORBELL SPEAKER</span>
        </div>
        <blockquote className="sq-spoken-quote">
          "{reply_to_visitor}"
        </blockquote>
        {follow_up_question && (
          <p className="sq-followup-prompt">
            Follow-up Prompted: <em>{follow_up_question}</em>
          </p>
        )}
      </div>

      {/* Reasoning & Rationale */}
      <div className="sq-reasoning-box">
        <div className="sq-box-heading">
          <CheckCircle2 size={15} className="text-stone-400" />
          <span>SECURITY EVALUATION REASONING</span>
        </div>
        <p className="sq-reasoning-text">{reasoning}</p>
      </div>

      {/* Delivery / Trusted Schedule Info */}
      {matched_delivery_id && (
        <div className="sq-delivery-match-pill">
          <Package size={15} className="text-emerald" />
          <span>
            Matched Schedule Roster: <strong>{matched_delivery_id}</strong>
          </span>
        </div>
      )}

      {/* Safety Interventions */}
      {safety_interventions.length > 0 && (
        <div className="sq-interventions-container">
          <div className="sq-box-heading">
            <AlertOctagon size={15} className="text-amber" />
            <span>DETERMINISTIC SAFETY OVERRIDES ENFORCED</span>
          </div>
          <div className="sq-interventions-list">
            {safety_interventions.map((item, idx) => (
              <span key={idx} className="sq-intervention-chip">
                {item.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
