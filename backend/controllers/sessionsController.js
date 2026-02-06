const MilkingSession = require('../models/MilkingSession');

// GET /sessions - Retrieve milking sessions with pagination
const getSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Page and limit must be greater than 0',
        data: null
      });
    }

    const totalSessions = await MilkingSession.countDocuments();
    const totalPages = Math.ceil(totalSessions / limit);

    const sessions = await MilkingSession.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const formattedSessions = sessions.map((session) => ({
      id: session._id || session.id,
      start_time: session.start_time.toISOString(),
      end_time: session.end_time.toISOString(),
      duration: session.duration,
      milk_quantity: session.milk_quantity,
    }));

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Sessions retrieved successfully',
      data: {
        sessions: formattedSessions,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalSessions: totalSessions,
          limit: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch milking sessions',
      data: null
    });
  }
};

// POST /sessions - Save milking session details
const createSession = async (req, res) => {
  try {
    const { start_time, end_time, duration, milk_quantity } = req.body;

    if (!start_time || !end_time || duration === undefined || milk_quantity === undefined) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Missing required fields',
        data: null
      });
    }

    if (duration < 0 || milk_quantity < 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Duration and milk_quantity must be non-negative',
        data: null
      });
    }

    const session = new MilkingSession({
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      duration: parseInt(duration),
      milk_quantity: parseFloat(milk_quantity),
    });

    const savedSession = await session.save();

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Milking session created successfully',
      data: {
        id: savedSession._id || savedSession.id,
        start_time: savedSession.start_time.toISOString(),
        end_time: savedSession.end_time.toISOString(),
        duration: savedSession.duration,
        milk_quantity: savedSession.milk_quantity,
      }
    });
  } catch (error) {
    console.error('Error creating session:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message || 'Failed to create milking session',
      data: null
    });
  }
};

module.exports = {
  getSessions,
  createSession
};
