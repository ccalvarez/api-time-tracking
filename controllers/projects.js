const { validationResult } = require('express-validator/check');

const ProjectModel = require('../models/project');

exports.createProject = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  try {
    const project = ProjectModel({
      name: req.body.name.trim(),
      user: req.body.userId.trim(),
    });

    project
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