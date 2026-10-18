import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.jsx';
import { CurtainTransition } from './components/CurtainTransition.jsx';
import { SecurityRadarBackground } from './components/SecurityRadarBackground.jsx';
import { DemoScenarios } from './components/DemoScenarios.jsx';
import { DoorbellPanel } from './components/DoorbellPanel.jsx';
import { ResultCard } from './components/ResultCard.jsx';
import { RecentVisitors } from './components/RecentVisitors.jsx';
import { OwnerAlertPanel } from './components/OwnerAlertPanel.jsx';
import { SecurityRosterModal } from './components/SecurityRosterModal.jsx';
import { fetchHealth, verifyVisitor, fetchLogs, fetchRoster } from './services/api.js';
import { ShieldCheck, Cpu, Lock } from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState({ status: 'connecting', aiMode: 'mock' });
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [round, setRound] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentTime, setCurrentTime] = useState('');

  // Dark/Light Theme with Theatrical Curtain Transition
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('guestverify-theme') || 'dark';
  });
  const [isCurtainActive, setIsCurtainActive] = useState(false);
  const [curtainTargetTheme, setCurtainTargetTheme] = useState(theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    if (isCurtainActive) return;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setCurtainTargetTheme(nextTheme);
    setIsCurtainActive(true);

    // Switch theme halfway through curtain close
    setTimeout(() => {
      setTheme(nextTheme);
      localStorage.setItem('guestverify-theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    }, 320);

    // Reset curtain after swipe completes
    setTimeout(() => {
      setIsCurtainActive(false);
    }, 720);
  };

  // Navigation tab & modal state
  const [activeTab, setActiveTab] = useState('intercom');
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [rosterData, setRosterData] = useState(null);

  // Live IST Clock (+05:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setCurrentTime(`${istString} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Refresh logs from backend
  const loadRecentLogs = useCallback(() => {
    fetchLogs(50)
      .then((data) => {
        const logItems = Array.isArray(data) ? data : data.logs || [];
        setLogs(logItems);

        // Preload recent suspicious events into alert feed if alerts empty
        setAlerts((prevAlerts) => {
          if (prevAlerts.length > 0) return prevAlerts;
          const suspiciousLogs = logItems.filter((l) => l.verdict === 'SUSPICIOUS').slice(0, 3);
          return suspiciousLogs.map((l) => ({
            id: l.id || `alert-${l.timestamp}`,
            time: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            visitorMessage: l.visitorMessage,
            reasoning: l.reasoning,
          }));
        });
      })
      .catch((err) => {
        console.warn('Failed to fetch logs:', err.message);
      });
  }, []);

  // Initial load: health, logs, and security roster
  useEffect(() => {
    fetchHealth()
      .then((data) => setHealth(data))
      .catch((err) => {
        console.warn('Health check error:', err.message);
        setHealth({ status: 'offline', aiMode: 'mock' });
      });

    fetchRoster()
      .then((data) => setRosterData(data))
      .catch((err) => {
        console.warn('Failed to fetch roster:', err.message);
      });

    loadRecentLogs();
  }, [loadRecentLogs]);

  // Handle header tab navigation
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'roster') {
      setIsRosterOpen(true);
    } else if (tab === 'intercom') {
      setIsRosterOpen(false);
      const el = document.getElementById('intercom-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'audit') {
      setIsRosterOpen(false);
      const el = document.getElementById('audit-section');
      el?.scrollIntoView({ behavior: 'smooth' });
      el?.classList.add('pulse-highlight');
      setTimeout(() => el?.classList.remove('pulse-highlight'), 1800);
    }
  };

  // Text-to-speech speaker synthesis
  const speakSpokenReply = useCallback(
    (text) => {
      if (!speechEnabled || !window.speechSynthesis || !text) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
      }
    },
    [speechEnabled]
  );

  // Handle Scenario selection
  const handleSelectScenario = (scenario) => {
    setMessage(scenario.text);
    setActiveScenarioId(scenario.id);
  };

  // Ring the doorbell / submit response
  const handleRingBell = async () => {
    setLoading(true);
    setError(null);

    const visitorText = message;

    // Add visitor message to intercom chat history immediately
    setConversation((prev) => [
      ...prev,
      { role: 'visitor', text: visitorText, timestamp: new Date().toISOString() },
    ]);

    try {
      const result = await verifyVisitor({
        message: visitorText,
        statement: visitorText,
        conversationId,
      });

      setLastResult(result);
      setConversationId(result.conversationId);
      setRound(result.round || 0);

      // Add guard response to intercom chat
      setConversation((prev) => [
        ...prev,
        {
          role: 'guard',
          text: result.reply_to_visitor,
          verdict: result.verdict,
          timestamp: result.timestamp,
        },
      ]);

      // Speak reply through browser speaker
      speakSpokenReply(result.reply_to_visitor);

      // If suspicious, trigger immediate simulated owner notification
      if (result.verdict === 'SUSPICIOUS') {
        const newAlert = {
          id: `alert-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          visitorMessage: visitorText,
          reasoning: result.reasoning,
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }

      // Re-fetch persistent logs from backend
      loadRecentLogs();

      // Clear input box so visitor can type follow-up answer or next statement
      setMessage('');
      setActiveScenarioId(null);
    } catch (err) {
      setError(err.message || 'Doorbell connection error');
    } finally {
      setLoading(false);
    }
  };

  // Reset current conversation session
  const handleResetConversation = () => {
    setMessage('');
    setConversationId(null);
    setRound(0);
    setConversation([]);
    setLastResult(null);
    setError(null);
    setActiveScenarioId(null);
  };

  // Dismiss a single alert
  const handleDismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  // Dismiss all alerts
  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className={`app-wrapper theme-${theme}`} data-theme={theme}>
      {/* Theatrical Curtain Transition Overlay */}
      <CurtainTransition isActive={isCurtainActive} targetTheme={curtainTargetTheme} />

      {/* Dynamic Ambient Background Lighting & Security Radar Grid */}
      <div className="ambient-background" aria-hidden="true">
        <SecurityRadarBackground theme={theme} />
        <div className="ambient-spotlight" />
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
        <div className="ambient-grid-mesh" />
        <div className="ambient-grain-overlay" />
      </div>

      <div className="app-container">
        {/* Orchid-Style Top Navigation & Status Bar */}
        <Header
          aiMode={health.aiMode}
          speechEnabled={speechEnabled}
          setSpeechEnabled={setSpeechEnabled}
          currentTime={currentTime}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          onRingBell={handleRingBell}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Main Dashboard Layout */}
        <main className="main-content">
          {/* Architectural Hero Thesis */}
          <div className="hero-thesis-section">
            <div className="hero-thesis-badge">
              <span className="thesis-dot" />
              <span>AUTONOMOUS ESTATE ACCESS // ZERO-TRUST DEFENSE</span>
            </div>
            <h1 className="hero-thesis-title">
              Autonomous perimeter verification <span className="serif-highlight">for private residences.</span>
            </h1>
            <p className="hero-thesis-desc">
              Direct your estate gate with real-time multimodal AI reasoning, physical chime controls, and deterministic safety overrides.
            </p>
          </div>

          {/* 3D Tactile Test Scenarios Switchboard */}
          <DemoScenarios
            onSelectScenario={handleSelectScenario}
            activeScenarioId={activeScenarioId}
            disabled={loading}
          />

        {error && (
          <div className="error-banner">
            <span className="error-title">Error:</span> {error}
            <button onClick={() => setError(null)} className="error-dismiss">×</button>
          </div>
        )}

        {/* 2-Column Product Grid */}
        <div className="product-layout">
          {/* Left Column: Doorbell Intercom & Decision Result */}
          <div className="column-left" id="intercom-section">
            <DoorbellPanel
              message={message}
              setMessage={setMessage}
              onRingBell={handleRingBell}
              loading={loading}
              conversation={conversation}
              onResetConversation={handleResetConversation}
              round={round}
            />

            <ResultCard result={lastResult} loading={loading} />
          </div>

          {/* Right Column: Owner Alerts & Visitor Logs */}
          <div className="column-right">
            <OwnerAlertPanel
              alerts={alerts}
              onDismissAlert={handleDismissAlert}
              onClearAll={handleClearAllAlerts}
            />

            <div id="audit-section">
              <RecentVisitors logs={logs} onSelectLog={(log) => setLastResult(log)} />
            </div>
          </div>
        </div>

        {/* Architectural Security Architecture Showcase */}
        <section className="estate-specs-section">
          <div className="specs-header">
            <span className="specs-tag">ZERO-TRUST VERIFICATION PROTOCOL</span>
            <h3 className="specs-title">Autonomous Estate Defense Architecture</h3>
            <p className="specs-desc">
              Every doorbell activation runs through multi-tiered verification before any physical gate strike is released.
            </p>
          </div>
          <div className="specs-grid">
            <div className="spec-card">
              <div className="spec-icon-wrap">
                <ShieldCheck size={20} className="text-emerald" />
              </div>
              <h4 className="spec-label">Ground-Truth Schedule Sync</h4>
              <p className="spec-detail">
                Cross-validates courier carrier IDs against encrypted <code>deliveries.json</code> schedules and time windows.
              </p>
            </div>
            <div className="spec-card">
              <div className="spec-icon-wrap">
                <Cpu size={20} className="text-cyan" />
              </div>
              <h4 className="spec-label">Autonomous Conversational Reasoning</h4>
              <p className="spec-detail">
                AWS Bedrock Converse conducts dynamic, context-aware interrogation to clarify unknown or incomplete visitor statements.
              </p>
            </div>
            <div className="spec-card">
              <div className="spec-icon-wrap">
                <Lock size={20} className="text-amber" />
              </div>
              <h4 className="spec-label">Deterministic Override Firewall</h4>
              <p className="spec-detail">
                Hardened deterministic rules intercept prompt injection jailbreaks, abusive discourse, and unregistered visitor claims.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Security Roster Modal */}
      <SecurityRosterModal
        roster={rosterData}
        isOpen={isRosterOpen}
        onClose={() => {
          setIsRosterOpen(false);
          setActiveTab('intercom');
        }}
      />

      {/* Footer Info */}
      <footer className="footer-bar">
        <span>GuestVerify Security System • Active Protection</span>
        <span>Audit Log: backend/logs/decisions.jsonl</span>
      </footer>
    </div>
  </div>
);
}
