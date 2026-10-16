import fs from 'fs';
import { config } from '../config.js';

let cachedData = null;
let lastMtime = 0;

/**
 * Loads deliveries data with automatic cache invalidation on file modification.
 */
export function getDeliveriesData() {
  try {
    const stats = fs.statSync(config.paths.deliveriesJson);
    if (!cachedData || stats.mtimeMs > lastMtime) {
      const raw = fs.readFileSync(config.paths.deliveriesJson, 'utf-8');
      cachedData = JSON.parse(raw);
      lastMtime = stats.mtimeMs;
    }
    return cachedData;
  } catch (err) {
    console.error('[deliveryStore] Failed to read deliveries.json:', err.message);
    return {
      residents: [],
      expected_deliveries: [],
      trusted_visitors: [],
    };
  }
}

/**
 * Find delivery by its unique identifier.
 */
export function findDeliveryById(deliveryId) {
  if (!deliveryId) return null;
  const data = getDeliveriesData();
  return data.expected_deliveries.find((d) => d.id === deliveryId) || null;
}

/**
 * Find matching trusted visitor by name.
 */
export function findTrustedVisitor(name) {
  if (!name) return null;
  const data = getDeliveriesData();
  const normalized = name.toLowerCase().trim();
  return (
    data.trusted_visitors.find((v) =>
      v.name.toLowerCase().includes(normalized) || normalized.includes(v.name.toLowerCase())
    ) || null
  );
}

/**
 * Checks whether the current time falls within [window_start, window_end].
 * Supports passing custom current time (e.g. for deterministic testing).
 */
export function isTimeInsideWindow(windowStart, windowEnd, currentTime = new Date()) {
  const start = new Date(windowStart).getTime();
  const end = new Date(windowEnd).getTime();
  const now = new Date(currentTime).getTime();

  if (isNaN(start) || isNaN(end) || isNaN(now)) {
    return false;
  }

  return now >= start && now <= end;
}

/**
 * Returns a list of all resident names (used for leakage prevention).
 */
export function getAllResidentNames() {
  const data = getDeliveriesData();
  return data.residents || [];
}

/**
 * Returns a list of all tracking number snippets (used for leakage prevention).
 */
export function getAllTrackingLast4() {
  const data = getDeliveriesData();
  return (data.expected_deliveries || []).map((d) => d.tracking_last4).filter(Boolean);
}
