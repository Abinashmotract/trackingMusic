const mongoose = require('mongoose');
const crypto = require('crypto');

const milkingSessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => crypto.randomUUID(),
  },
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

// Create index on _id field for faster queries
milkingSessionSchema.index({ _id: 1 });

// Virtual for id field (maps _id to id in responses)
milkingSessionSchema.virtual('id').get(function() {
  return this._id;
});

// Ensure virtual fields are serialized
milkingSessionSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('MilkingSession', milkingSessionSchema);
