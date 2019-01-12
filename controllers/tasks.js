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
        res
          .status(201)
          .json(
            req.body.start
              ? { _id: result._id, start: result.intervals[0].start }
              : { _id: result._id }
          );
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

              const lastIntervalEnd = new Date();
              TaskModel.update(
                {
                  _id: result._id,
                  'intervals.start': new Date(lastIntervalStart),
                },
                {
                  $set: { state: 'paused', 'intervals.$.end': lastIntervalEnd },
                },
                { runValidators: true }
              )
                .then(updated => {
                  res.status(200).json({ end: lastIntervalEnd });
                })
                .catch(err => {
                  if (!err.statusCode) {
                    err.statusCode = 500;
                    next(err);
                  }
                });
            }
          } else if (req.body.state == 'running') {
            if (result.state != 'paused' && result.state != 'pending') {
              res.status(409).send({
                error: 409,
                message: 'La tarea no está pausada ni pendiente',
              });
            } else {
              const newIntervalStart = new Date();
              result.intervals.push({ start: newIntervalStart, end: null });
              result.state = 'running';
              result
                .save()
                .then(updated => {
                  res.status(200).json({ start: newIntervalStart });
                })
                .catch(err => {
                  if (!err.statusCode) {
                    err.statusCode = 500;
                    next(err);
                  }
                });
            }
          } else if (req.body.state == 'finished') {
            if (result.state != 'running' && result.state != 'paused') {
              res.status(409).send({
                error: 409,
                message: 'La tarea no está en ejecución ni pausada',
              });
            } else {
              const lastIntervalStart = Math.max(
                ...result.intervals.map(interval => {
                  return interval.start;
                })
              );

              const lastInterval = Array.from(result.intervals).find(i => {
                return (
                  i.start.toISOString() ==
                  new Date(lastIntervalStart).toISOString()
                );
              });

              if (lastInterval.end == null) {
                // running task

                const lastIntervalEnd = new Date();

                TaskModel.update(
                  {
                    _id: result._id,
                    'intervals.start': new Date(lastIntervalStart),
                  },
                  {
                    $set: {
                      state: 'finished',
                      'intervals.$.end': lastIntervalEnd,
                    },
                  },
                  { runValidators: true }
                )
                  .then(updated => {
                    res.status(200).json({ end: lastIntervalEnd });
                  })
                  .catch(err => {
                    if (!err.statusCode) {
                      err.statusCode = 500;
                      next(err);
                    }
                  });
              } else {
                // paused task
                TaskModel.update(
                  {
                    _id: result._id,
                  },
                  {
                    $set: { state: 'finished' },
                  },
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
            }
          } else {
            res.status(400).send({
              error: 400,
              message: 'Estado de la tarea no es válido',
            });
          }

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

exports.getTasksByUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  try {
    TaskModel.find({ user: new mongoose.Types.ObjectId(req.params.userId) })
      .populate('project')
      .then(result => {
        res.status(200).json(result);
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

exports.getReportByUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const start = new Date(req.body.start);
  const end = new Date(req.body.end);

  try {
    TaskModel.find({
      $and: [
        { user: userId },
        {
          $or: [
            { 'intervals.start': { $gte: start, $lt: end } },
            {
              $and: [
                { 'intervals.start': { $lt: start } },
                {
                  $or: [
                    { 'intervals.end': null },
                    { 'intervals.end': { $gte: start } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
      .populate('project')
      .then(result => {
        const tasks = result.map(task => {
          const description = task.description;
          const project = task.project.name;

          // TODO: optimizar, hacer sólo un reduce o sólo un map:

          const totalTime = task.intervals
            .sort((a, b) => {
              // TODO: hacer este ordenamiento en base de datos
              return a.start - b.start;
            })
            .reduce((accumulator, currentValue) => {
              currentValue.accumulatedTime =
                accumulator +
                (new Date(currentValue.end) - new Date(currentValue.start));
              // return (
              //   accumulator +
              //   (new Date(currentValue.end) - new Date(currentValue.start))
              // );
              return currentValue.accumulatedTime;
            }, 0);

          return task.intervals
            .sort((a, b) => {
              // TODO: hacer este ordenamiento en base de datos
              return a.start - b.start;
            })
            .map(interval => {
              const start = new Date(interval.start);
              const end = new Date(interval.end);
              const intervalTime = end - start;
              return {
                start: start.toGMTString(),
                end: end.toGMTString(),
                date: [
                  start
                    .getDate()
                    .toString()
                    .padStart(2, '0'),
                  (start.getMonth() + 1).toString().padStart(2, '0'),
                  start.getFullYear().toString(),
                ].join('-'),
                description,
                project,
                totalTime,
                intervalTime,
                intervalPercentage: (intervalTime * 100) / totalTime,
                intervalAccumulatedPercentage:
                  (interval.accumulatedTime * 100) / totalTime,
              };
            });
        }); // TODO: agregar aquí un sort para que los intervalos se ordenen estrictamente por start

        res.status(200).json(tasks);
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
