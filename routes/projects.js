const express = require('express');
const { body } = require('express-validator/check');
const mongoose = require('mongoose');
// todo: sanitizar body
// const { sanitizeBody } = require('express-validator/filter');

const projectsController = require('../controllers/projects');

const isAuth = require('../middleware/isAuth.js');

const router = express.Router();

// POST /projects
router.post(
  '/',
  [
    body('name')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Nombre del proyecto es requerido'),
    body('userId')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Usuario del proyecto es requerido')
      .custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return Promise.reject('Id del usuario no tiene un formato válido');
        }
        return true;
      }),
    isAuth,
  ],
  projectsController.createProject
);

module.exports = router;
