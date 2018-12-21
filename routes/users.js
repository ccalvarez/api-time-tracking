const express = require('express');
const { body, param } = require('express-validator/check');
const mongoose = require('mongoose');
// todo: sanitizar body
// const { sanitizeBody } = require('express-validator/filter');

const usersController = require('../controllers/users');
const tasksController = require('../controllers/tasks');

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
      .withMessage('Password inválido'),
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

module.exports = router;
