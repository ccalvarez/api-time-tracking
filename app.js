require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users');
const systemsRoutes = require('./routes/systems');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  const allowedOrigins = ['https://s.codepen.io', 'http://localhost:8081'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/users', usersRoutes);
app.use('/systems', systemsRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

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
