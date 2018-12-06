const express = require('express');
const { body } = require('express-validator/check');
// todo: sanitizar body
// const { sanitizeBody } = require('express-validator/filter');

const systemsController = require('../controllers/systems');

const router = express.Router();

// POST /systems
router.post(
  '/',
  [
    body('name')
      .trim()
      .not()
      .isEmpty(),
    body('userId')
      .trim()
      .not()
      .isEmpty(),
  ],
  systemsController.createSystem
);

module.exports = router;
