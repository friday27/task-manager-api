const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/queries');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

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

app.use(taskRouter);
app.use(userRouter);

module.exports = app;