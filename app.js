const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users');
const systemsRoutes = require('./routes/systems');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', usersRoutes);
app.use('/systems', systemsRoutes);

app.listen(5000, () => {
  console.log('Time Tracking API listening on port 5000');
});
