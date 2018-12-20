const { validationResult } = require('express-validator/check');

const ProjectModel = require('../models/project');

exports.createProject = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  try {
    const project = ProjectModel({
      name: req.body.name,
      user: req.body.userId,
    });

    project
      .save()
      .then(result => {
        res.status(201).json({ _id: result._id });
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
