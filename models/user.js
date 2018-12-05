const mongoose = require('mongoose');

let User = null;

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: 'users' }
);

User = mongoose.model('User', userSchema);

module.exports = User;
