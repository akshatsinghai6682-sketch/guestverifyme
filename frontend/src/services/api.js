/**
 * Client API for GuestVerify backend endpoints.
 */

export async function fetchHealth() {
  const res = await fetch('/health');
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return await res.json();
}

export async function verifyVisitor({ message, conversationId }) {
  const res = await fetch('/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, conversationId }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Verification failed: HTTP ${res.status}`);
  }

  return await res.json();
}

export async function fetchLogs(limit = 50) {
  const res = await fetch(`/logs?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch logs: ${res.status}`);
  return await res.json();
}
