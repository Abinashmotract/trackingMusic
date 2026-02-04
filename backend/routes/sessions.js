const express = require('express');
const router = express.Router();
const MilkingSession = require('../models/MilkingSession');

// GET /sessions - Retrieve all milking sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await MilkingSession.find()
      .sort({ created_at: -1 })
      .lean();

    // Format the response to match the expected format
    const formattedSessions = sessions.map((session) => ({
      id: session._id.toString(),
      start_time: session.start_time.toISOString(),
      end_time: session.end_time.toISOString(),
      duration: session.duration,
      milk_quantity: session.milk_quantity,
    }));

    res.json(formattedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch milking sessions' });
  }
});

// POST /sessions - Save milking session details
router.post('/', async (req, res) => {
  try {
    const { start_time, end_time, duration, milk_quantity } = req.body;

    // Validation
    if (!start_time || !end_time || duration === undefined || milk_quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (duration < 0 || milk_quantity < 0) {
      return res.status(400).json({ error: 'Duration and milk_quantity must be non-negative' });
    }

    const session = new MilkingSession({
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      duration: parseInt(duration),
      milk_quantity: parseFloat(milk_quantity),
    });

    const savedSession = await session.save();

    res.status(201).json({
      id: savedSession._id.toString(),
      start_time: savedSession.start_time.toISOString(),
      end_time: savedSession.end_time.toISOString(),
      duration: savedSession.duration,
      milk_quantity: savedSession.milk_quantity,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create milking session' });
  }
});

module.exports = router;
