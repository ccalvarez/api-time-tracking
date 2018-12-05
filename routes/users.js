const express = require('express');

const usersController = require('../controllers/users');

const router = express.Router();

router.post('/', (req, res, next) => {
  usersController
    .createUser(req.body.email, req.body.password)
    .then(user => {
      if (user != undefined) {
        res.status(201).json(user);
      }
    })
    .catch(err => res.status(500).send(`Se encontró un error: ${err}`));
});

module.exports = router;
