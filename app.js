require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const tasksRoutes = require('./routes/tasks');

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
app.use('/projects', projectsRoutes);
app.use('/tasks', tasksRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ error: error.statusCode, message: message });
});

mongoose
  .connect(
    process.env.DATABASE,
    { useCreateIndex: true, useNewUrlParser: true }
  )
  .then(result => {
    app.listen(process.env.PORT, () => {
      console.log(`Time Tracking API listening on port ${process.env.PORT}...`);
    });
  })
  .catch(err => {
    console.log(err);
  });
