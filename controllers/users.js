const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const UserModel = require('../models/user');

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  try {
    bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
      const user = UserModel({
        email: req.body.email.trim(),
        password: hashedPassword,
      });

      user
        .save()
        .then(result => {
          res.status(201).send();
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
