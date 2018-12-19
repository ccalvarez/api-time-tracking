const { validationResult } = require('express-validator/check');
const mongoose = require('mongoose');
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
      intervals: req.body.start ? { start: new Date(), end: null } : [],
      delayReason: req.body.delayReason,
      comments: req.body.comments,
      state: req.body.start ? 'running' : 'pending',
      includeInReport: req.body.includeInReport,
      project: req.body.projectId,
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

exports.editTask = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  // pendiente la edición de otros campos además del state

  try {
    let task = TaskModel.findById(new mongoose.Types.ObjectId(req.body.taskId))
      .then(result => {
        if (result) {
          if (req.body.state == 'paused') {
            if (result.state != 'running') {
              res
                .status(409)
                .send({ error: 409, message: 'La tarea no está en ejecución' });
            } else {
              const lastIntervalStart = Math.max(
                ...result.intervals.map(interval => {
                  return interval.start;
                })
              );

              TaskModel.update(
                {
                  _id: result._id,
                  'intervals.start': new Date(lastIntervalStart),
                },
                { $set: { state: 'paused', 'intervals.$.end': new Date() } },
                { runValidators: true }
              )
                .then(updated => {
                  res.status(200).send();
                })
                .catch(err => {
                  if (!err.statusCode) {
                    err.statusCode = 500;
                    next(err);
                  }
                });
            }
          } else {
            res.status(200).send();
          }

          // else if (req.body.state == 'running'... 'finished'... )
          // qué hace si no envían ningún campo a actualizar?
        } else {
          res.status(404).send({ error: 404, message: 'La tarea no existe' });
        }
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
          next(err);
        }
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
