const express = require('express');
const { body } = require('express-validator/check');
const mongoose = require('mongoose');
// todo: sanitizar body
// const { sanitizeBody } = require('express-validator/filter');

const tasksController = require('../controllers/tasks');

const router = express.Router();

// POST /tasks
router.post(
  '/',
  [
    body('description')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Descripción de la tarea es requerida'),
    body('delayReason').trim(),
    body('comments').trim(),
    body('systemId')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Sistema de la tarea es requerido'),
    body('userId')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Usuario de la tarea es requerido'),
    body('start')
      .not()
      .isEmpty()
      .withMessage('Indicador de inicio de la tarea es requerido')
      .isBoolean()
      .withMessage('Indicador de inicio de la tarea debe ser Boolean'),
  ],
  tasksController.createTask
);

// PATCH /tasks
router.patch(
  '/',
  [
    body('taskId')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Id de la tarea es requerido')
      .custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return Promise.reject('Id de la tarea no tiene un formato válido');
        }
        return true;
      }),
    body('state')
      .trim()
      .isIn(['pending', 'running', 'paused', 'finished'])
      .withMessage('Estado de la tarea no es válido'),
  ],
  tasksController.editTask
);

module.exports = router;
