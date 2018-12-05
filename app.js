require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users');
const systemsRoutes = require('./routes/systems');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://s.codepen.io');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

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
