const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  try {
    bcrypt.hash(req.body.password, 12).then(hashedPassword => {
      const user = UserModel({
        email: req.body.email,
        password: hashedPassword,
      });

      user
        .save()
        .then(result => {
          res.status(201).send();
        })
        .catch(err => {
          if (!err.statusCode) {
            if (err.message.toLowerCase().includes('duplicate')) {
              err.statusCode = 409;
              err.message = 'Ya existe un usuario registrado con ese Email';
            } else {
              err.statusCode = 500;
            }
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

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  UserModel.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('Email no registrado');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Credenciales incorrectas');
        error.statusCode = 401;
        throw error;
      }
      // credenciales correctas, genera JWT:
      let date = new Date();
      date.setDate(date.getDate() + 30);

      const token = jwt.sign(
        {
          exp: date.getTime(),
          data: { userId: loadedUser._id.toString() },
        },
        process.env.JWT_SECRET
      );

      res.status(200).send({ token: token, _id: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
