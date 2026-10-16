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
} from 'lucide-react';

export function ResultCard({ result, loading }) {
  if (loading) {
    return (
      <div className="result-card loading-skeleton">
        <div className="skeleton-line title" />
        <div className="skeleton-line bar" />
        <div className="skeleton-line text" />
        <div className="skeleton-line text short" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-card empty-card">
        <div className="empty-icon-ring">
          <Cpu size={24} className="text-muted" />
        </div>
        <p className="empty-text">No active evaluation</p>
        <p className="empty-subtext">Ring the doorbell to receive real-time security analysis.</p>
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

  const isAuthorized = verdict === 'AUTHORIZED';
  const isNeedsInfo = verdict === 'NEEDS_MORE_INFO';
  const isSuspicious = verdict === 'SUSPICIOUS';

  const badgeConfig = {
    AUTHORIZED: {
      label: 'AUTHORIZED',
      icon: ShieldCheck,
      colorClass: 'verdict-authorized',
      actionIcon: Unlock,
      actionText: matched_delivery_id ? 'Package Drop Approved' : 'Visitor Entry Approved',
    },
    NEEDS_MORE_INFO: {
      label: 'NEEDS MORE INFO',
      icon: HelpCircle,
      colorClass: 'verdict-needs-info',
      actionIcon: Lock,
      actionText: `Awaiting Follow-up (Round ${round}/2)`,
    },
    SUSPICIOUS: {
      label: 'SUSPICIOUS - ACCESS DENIED',
      icon: ShieldAlert,
      colorClass: 'verdict-suspicious',
      actionIcon: Lock,
      actionText: 'Owner Notified • Access Denied',
    },
  }[verdict] || {
    label: verdict,
    icon: HelpCircle,
    colorClass: 'verdict-needs-info',
    actionIcon: Lock,
    actionText: action_taken,
  };

  const VerdictIcon = badgeConfig.icon;
  const ActionIcon = badgeConfig.actionIcon;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className={`result-card ${badgeConfig.colorClass}`}>
      {/* Header with Verdict Badge and Simulated Hardware Action */}
      <div className="result-header">
        <div className={`verdict-badge ${badgeConfig.colorClass}`}>
          <VerdictIcon size={18} />
          <span>{badgeConfig.label}</span>
        </div>

        <div className="action-pill">
          <ActionIcon size={14} />
          <span>{badgeConfig.actionText}</span>
        </div>
      </div>

      {/* Confidence Score Meter */}
      <div className="confidence-section">
        <div className="confidence-label-row">
          <span className="confidence-title">AI Confidence Score</span>
          <span className="confidence-val">{confidencePercent}%</span>
        </div>
        <div className="confidence-track">
          <div
            className={`confidence-fill ${badgeConfig.colorClass}`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Spoken Doorbell Reply */}
      <div className="spoken-reply-box">
        <div className="box-title-row">
          <Volume2 size={15} className="text-cyan" />
          <span className="box-title">Spoken Doorbell Intercom Audio</span>
        </div>
        <p className="spoken-text">"{reply_to_visitor}"</p>
        {follow_up_question && (
          <p className="followup-hint">
            Prompted: <em>{follow_up_question}</em>
          </p>
        )}
      </div>

      {/* Decision Reasoning */}
      <div className="reasoning-box">
        <div className="box-title-row">
          <CheckCircle2 size={15} className="text-muted" />
          <span className="box-title">Security Evaluation Reasoning</span>
        </div>
        <p className="reasoning-text">{reasoning}</p>
      </div>

      {/* Matched Delivery Details if available */}
      {matched_delivery_id && (
        <div className="matched-delivery-box">
          <Package size={15} className="text-emerald" />
          <span>
            Matched Delivery Schedule: <strong>{matched_delivery_id}</strong>
          </span>
        </div>
      )}

      {/* Safety Rules Interventions Tag */}
      {safety_interventions.length > 0 && (
        <div className="safety-interventions-box">
          <div className="box-title-row">
            <AlertOctagon size={15} className="text-amber" />
            <span className="box-title">Safety Rule Interventions Enforced</span>
          </div>
          <div className="interventions-tags">
            {safety_interventions.map((item, idx) => (
              <span key={idx} className="intervention-tag">
                {item.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
