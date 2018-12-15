const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const taskSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    intervals: { type: Array }, // { start: datetime, end: datetime }
    delayReason: { type: String, trim: true },
    comments: { type: String, trim: true },
    state: {
      type: String,
      required: true,
      trim: true,
      // enum: ['pending', 'running', 'paused', 'finished'],
      enum: {
        values: 'pending running paused finished'.split(' '),
        message: 'Estado de la tarea no es válido',
      },
    },
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
