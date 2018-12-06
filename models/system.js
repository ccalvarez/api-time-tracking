const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

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

// Valida que el user provisto exista en la colección users
systemSchema.plugin(idValidator);

module.exports = mongoose.model('System', systemSchema);
