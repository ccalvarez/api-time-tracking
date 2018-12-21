const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const mongooseHidden = require('mongoose-hidden');

const projectSchema = new mongoose.Schema(
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
projectSchema.plugin(idValidator);

// Oculta campos en el objeto de retorno:
projectSchema.plugin(mongooseHidden(), {
  hidden: {
    _id: false,
    user: true,
    createdAt: true,
    updatedAt: true,
  },
});

module.exports = mongoose.model('Project', projectSchema);
