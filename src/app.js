const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/queries');
const path = require('path');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const publicDir = path.join(__dirname, '../public');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(publicDir));

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.use(taskRouter);
app.use(userRouter);

module.exports = app;