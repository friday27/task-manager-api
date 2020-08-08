const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
// const port = process.env.PORT;

//automatically parse JSON input
app.use(express.json()); 
app.use(userRouter); //register the router with express app
app.use(taskRouter);

// remove app.listen()

module.exports = app;