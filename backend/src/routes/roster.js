import express from 'express';
import { getDeliveriesData } from '../services/deliveryStore.js';

export const rosterRouter = express.Router();

/**
 * GET /roster
 * Returns the roster of expected deliveries, registered residents, and trusted visitors.
 */
rosterRouter.get('/roster', (req, res) => {
  try {
    const data = getDeliveriesData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve delivery roster' });
  }
});
