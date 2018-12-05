require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users');
const systemsRoutes = require('./routes/systems');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', usersRoutes);
app.use('/systems', systemsRoutes);

mongoose
  .connect(
    process.env.DATABASE,
    { useCreateIndex: true, useNewUrlParser: true }
  )
  .then(result => {
    app.listen(5000, () => {
      console.log('Time Tracking API listening on port 5000...');
    });
  })
  .catch(err => {
    console.log(err);
  });
