const express = require('express');
const { body } = require('express-validator/check');
// todo: sanitizar body
// const { sanitizeBody } = require('express-validator/filter');

const usersController = require('../controllers/users');

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

// GET /users
router.get('/', (req, res, next) => {
  res.status(200).json({ prueba: 'prueba' });
});

module.exports = router;
