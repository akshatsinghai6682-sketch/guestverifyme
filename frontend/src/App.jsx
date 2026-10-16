import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.jsx';
import { DemoScenarios } from './components/DemoScenarios.jsx';
import { DoorbellPanel } from './components/DoorbellPanel.jsx';
import { ResultCard } from './components/ResultCard.jsx';
import { RecentVisitors } from './components/RecentVisitors.jsx';
import { OwnerAlertPanel } from './components/OwnerAlertPanel.jsx';
import { fetchHealth, verifyVisitor, fetchLogs } from './services/api.js';

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

  // Initial load
  useEffect(() => {
    fetchHealth()
      .then((data) => setHealth(data))
      .catch((err) => {
        console.warn('Health check error:', err.message);
        setHealth({ status: 'offline', aiMode: 'mock' });
      });

    loadRecentLogs();
  }, [loadRecentLogs]);

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
    <div className="app-container">
      {/* Top Navigation & Status Bar */}
      <Header
        aiMode={health.aiMode}
        speechEnabled={speechEnabled}
        setSpeechEnabled={setSpeechEnabled}
        currentTime={currentTime}
      />

      {/* Main Dashboard Layout */}
      <main className="main-content">
        {/* Top: 1-Click Scenario presets */}
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
          <div className="column-left">
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

            <RecentVisitors logs={logs} onSelectLog={(log) => setLastResult(log)} />
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="footer-bar">
        <span>GuestVerify Security System • Active Protection</span>
        <span>Audit Log: backend/logs/decisions.jsonl</span>
      </footer>
    </div>
  );
}
