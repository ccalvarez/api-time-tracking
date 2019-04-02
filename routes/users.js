const express = require('express');
const { body, param } = require('express-validator/check');
const mongoose = require('mongoose');
// todo: sanitizar body
// const { sanitizeBody } = require('express-validator/filter');

const usersController = require('../controllers/users');
const tasksController = require('../controllers/tasks');
const projectsController = require('../controllers/projects');

const router = express.Router();

// POST /users
router.post(
  '/',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Password debe tener al menos 5 caracteres alfanuméricos'),
  ],
  usersController.signUp
);

// GET /users/:userId/tasks
router.get(
  '/:userId/tasks',
  [
    param('userId')
      .trim()
      .custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return Promise.reject('Id del usuario no tiene un formato válido');
        }
        return true;
      }),
  ],
  tasksController.getTasksByUser
);

// GET /users/:userId/report
router.post(
  '/:userId/report',
  [
    param('userId')
      .trim()
      .custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return Promise.reject('Id del usuario no tiene un formato válido');
        }
        return true;
      }),
    body('start')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Fecha de inicio es requerida')
      .isISO8601()
      .withMessage('Fecha de inicio no tiene un formato válido'),
    body('end')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Fecha de fin es requerida')
      .isISO8601()
      .withMessage('Fecha de fin no tiene un formato válido'),
  ],
  tasksController.getReportByUser
);

// GET /users/:userId/projects
router.get(
  '/:userId/projects',
  [
    param('userId')
      .trim()
      .custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return Promise.reject('Id del usuario no tiene un formato válido');
        }
        return true;
      }),
  ],
  projectsController.getProjectsByUser
);

// POST /users/login
router.post('/login', usersController.login);

module.exports = router;
