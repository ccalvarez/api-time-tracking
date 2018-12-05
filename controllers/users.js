const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const UserModel = require('../models/user');

exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect',
      errors: errors.array(),
    });
  }

  try {
    bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
      const user = UserModel({
        email: req.body.email.trim(),
        password: hashedPassword,
      });

      user.save(err => {
        if (err) {
          res.status(500).json(`Se encontró un error: ${err}`);
        } else {
          res.status(201).json(user);
        }
      });
    });
  } catch (err) {
    res.status(500).json(`Se encontró un error: ${err}`);
  }
};
