const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const taskSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    logTimes: { type: Array }, // { start: datetime, end: datetime }
    delayReason: { type: String },
    comments: { type: String },
    finished: { type: Boolean, required: true, default: false },
    system: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      index: true,
      ref: 'System',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Valida que el system y el user provistos existan en la base de datos
taskSchema.plugin(idValidator);

module.exports = mongoose.model('Task', taskSchema);
