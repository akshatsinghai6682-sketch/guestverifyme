import fs from 'fs';
import { config } from '../config.js';

let cachedData = null;
let lastMtime = 0;

const DEFAULT_DELIVERIES_DATA = {
  residents: ['John Smith', 'Emily Davis'],
  expected_deliveries: [
    {
      id: 'del-001',
      recipient: 'John Smith',
      carrier: 'Amazon',
      window_start: '2026-10-17T17:00:00+05:30',
      window_end: '2026-10-17T23:59:59+05:30',
      tracking_last4: '4821',
    },
    {
      id: 'del-002',
      recipient: 'John Smith',
      carrier: 'FedEx',
      window_start: '2026-10-17T10:00:00+05:30',
      window_end: '2026-10-17T12:00:00+05:30',
      tracking_last4: '9102',
    },
    {
      id: 'del-003',
      recipient: 'Emily Davis',
      carrier: 'DHL',
      window_start: '2026-10-18T14:00:00+05:30',
      window_end: '2026-10-18T16:30:00+05:30',
      tracking_last4: '3310',
    },
    {
      id: 'del-004',
      recipient: 'Emily Davis',
      carrier: 'Blue Dart',
      window_start: '2026-10-17T17:30:00+05:30',
      window_end: '2026-10-17T23:59:59+05:30',
      tracking_last4: '7744',
    },
    {
      id: 'del-005',
      recipient: 'John Smith',
      carrier: 'UPS',
      window_start: '2026-10-17T17:00:00+05:30',
      window_end: '2026-10-17T20:30:00+05:30',
      tracking_last4: '1198',
    },
  ],
  trusted_visitors: [
    {
      name: 'Sarah Jenkins',
      notes: 'Neighbor next door at #402, authorized for watering plants and spare keys',
    },
    {
      name: 'David Miller',
      notes: 'HVAC maintenance technician, pre-scheduled filter inspection',
    },
  ],
};

/**
 * Loads deliveries data with automatic cache invalidation on file modification.
 */
export function getDeliveriesData() {
  try {
    if (fs.existsSync(config.paths.deliveriesJson)) {
      const stats = fs.statSync(config.paths.deliveriesJson);
      if (!cachedData || stats.mtimeMs > lastMtime) {
        const raw = fs.readFileSync(config.paths.deliveriesJson, 'utf-8');
        cachedData = JSON.parse(raw);
        lastMtime = stats.mtimeMs;
      }
      return cachedData;
    }
    return DEFAULT_DELIVERIES_DATA;
  } catch (err) {
    console.warn('[deliveryStore] Using fallback delivery roster:', err.message);
    return DEFAULT_DELIVERIES_DATA;
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
