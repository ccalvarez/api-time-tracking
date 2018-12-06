const { validationResult } = require('express-validator/check');

const SystemModel = require('../models/system');

exports.createSystem = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  try {
    const system = SystemModel({
      name: req.body.name.trim(),
      user: req.body.userId.trim(),
    });

    system
      .save()
      .then(result => {
        res.status(201).json(result);
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
