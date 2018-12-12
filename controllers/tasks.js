const { validationResult } = require('express-validator/check');

const TaskModel = require('../models/task');

exports.createTask = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;

    throw error;
  }

  try {
    const task = TaskModel({
      description: req.body.description,
      logTimes: req.body.start ? { start: new Date(), end: null } : [],
      delayReason: req.body.delayReason,
      comments: req.body.comments,
      system: req.body.systemId,
      user: req.body.userId,
    });

    task
      .save()
      .then(result => {
        res.status(201).send({ _id: result._id });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
          // if (err.message.toLowerCase().includes('duplicate')) {
          //   err.statusCode = 409;
          //   err.message = 'Ya existe un usuario registrado con ese Email';
          // } else {
          //   err.statusCode = 500;
          // }
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
