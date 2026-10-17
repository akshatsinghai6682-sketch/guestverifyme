import React from 'react';
import { ShieldCheck, Package, Clock, UserCheck, Users, X, CheckCircle, AlertTriangle } from 'lucide-react';

export function SecurityRosterModal({ roster, isOpen, onClose }) {
  if (!isOpen) return null;

  const deliveries = roster?.expected_deliveries || [];
  const residents = roster?.residents || [];
  const trusted = roster?.trusted_visitors || [];

  const now = new Date();

  // Helper to determine delivery status
  const getDeliveryStatus = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (now >= start && now <= end) {
      return { label: 'ACTIVE NOW', class: 'status-active' };
    } else if (now > end) {
      return { label: 'EXPIRED WINDOW', class: 'status-expired' };
    } else {
      return { label: 'UPCOMING', class: 'status-upcoming' };
    }
  };

  return (
    <div className="sq-modal-backdrop" onClick={onClose}>
      <div className="sq-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="sq-modal-header">
          <div className="sq-modal-title-group">
            <ShieldCheck size={24} className="text-cyan" />
            <div>
              <h2 className="sq-modal-title">Authorized Security Roster</h2>
              <p className="sq-modal-subtitle">deliveries.json Ground-Truth Registry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="sq-modal-close-btn"
            title="Close Roster (Esc)"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="sq-modal-body">
          {/* Section 1: Expected Deliveries */}
          <div className="roster-section">
            <div className="roster-section-header">
              <Package size={16} className="text-cyan" />
              <h3>Expected Package Deliveries ({deliveries.length})</h3>
            </div>

            <div className="roster-deliveries-grid">
              {deliveries.map((del) => {
                const status = getDeliveryStatus(del.window_start, del.window_end);
                const startTime = new Date(del.window_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTime = new Date(del.window_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={del.id} className="roster-delivery-card">
                    <div className="delivery-card-top">
                      <span className="carrier-badge">{del.carrier}</span>
                      <span className={`status-badge ${status.class}`}>{status.label}</span>
                    </div>

                    <div className="delivery-recipient">
                      Recipient: <strong>{del.recipient}</strong>
                    </div>

                    <div className="delivery-time-row">
                      <Clock size={12} className="text-muted" />
                      <span>{startTime} – {endTime} IST</span>
                    </div>

                    <div className="delivery-tracking-row">
                      <span>Tracking: •••• {del.tracking_last4}</span>
                      <span className="delivery-id">{del.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Residents & Trusted Visitors */}
          <div className="roster-section">
            <div className="roster-split-row">
              {/* Residents */}
              <div className="roster-sub-col">
                <div className="roster-section-header">
                  <Users size={16} className="text-cyan" />
                  <h3>Household Residents</h3>
                </div>
                <div className="residents-pill-list">
                  {residents.map((name, idx) => (
                    <div key={idx} className="resident-chip">
                      <CheckCircle size={14} className="text-emerald" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trusted Visitors */}
              <div className="roster-sub-col">
                <div className="roster-section-header">
                  <UserCheck size={16} className="text-emerald" />
                  <h3>Trusted Visitors Registry</h3>
                </div>
                <div className="trusted-list">
                  {trusted.map((person, idx) => (
                    <div key={idx} className="trusted-item">
                      <span className="trusted-name">{person.name}</span>
                      <p className="trusted-notes">{person.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sq-modal-footer">
          <span className="modal-footer-hint">All visitor verification is checked against this ground-truth data in real-time.</span>
          <button onClick={onClose} className="btn-3d btn-3d-primary btn-sm">
            CLOSE ROSTER
          </button>
        </div>
      </div>
    </div>
  );
}
