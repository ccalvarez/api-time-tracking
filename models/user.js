const mongoose = require('mongoose');

const mongooseHidden = require('mongoose-hidden');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, collection: 'users' }
);

// Oculta el password en el objeto de retorno:
userSchema.plugin(mongooseHidden(), { hidden: { _id: false, password: true } });

module.exports = mongoose.model('User', userSchema);
