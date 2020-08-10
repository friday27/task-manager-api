const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/queries');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.post('/users', db.createUser);
app.delete('/users/:id', db.deleteUser);

app.get('/tasks', db.getTasks);
app.post('/tasks', db.addTasks);
app.patch('/tasks/:id', db.updateTasks);
app.delete('/tasks/:id', db.deleteTasks);

module.exports = app;