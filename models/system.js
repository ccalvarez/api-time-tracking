const mongoose = require('mongoose');

const systemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('System', systemSchema);
