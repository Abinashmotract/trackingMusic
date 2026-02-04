const mongoose = require('mongoose');

const milkingSessionSchema = new mongoose.Schema({
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  milk_quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MilkingSession', milkingSessionSchema);
