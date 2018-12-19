const express = require('express');
const { body } = require('express-validator/check');
// todo: sanitizar body
// const { sanitizeBody } = require('express-validator/filter');

const projectsController = require('../controllers/projects');

const router = express.Router();

// POST /projects
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
  projectsController.createProject
);

module.exports = router;
