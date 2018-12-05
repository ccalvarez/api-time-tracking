const express = require('express');
const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const usersController = require('../controllers/users');

const router = express.Router();

router.post(
  '/',
  [
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
  ],
  (req, res, next) => {
    // refactor: esto lo puedo enviar a controller, junto con req, res, next, para simplificar routes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed, entered data is incorrect',
        errors: errors.array(),
      });
    }

    usersController
      .createUser(req.body.email.trim(), req.body.password.trim())
      .then(user => {
        if (user != undefined) {
          res.status(201).json(user);
        }
      })
      .catch(err => res.status(500).json(`Se encontró un error: ${err}`));
  }
);

router.get('/', (req, res, next) => {
  res.status(200).json({ prueba: 'prueba' });
});

module.exports = router;
