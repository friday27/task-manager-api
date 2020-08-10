const pool = require('./pool');

const createUser = (request, response) => {
  const { name, email } = request.body;
  pool.query(`INSERT INTO users (name, email) VALUES ('${name}','${email}')`, (error, results) => {
    if (error) response.status(400).send();
    response.status(201).send({name, email});
  })
};

const deleteUser = (request, response) => {
  pool.query(`DELETE from users WHERE id = ${request.params.id}`, (error, results) => {
    if (error) response.status(400).send();
    response.status(200).send();
  })
};

const getTasks = (request, response) => {
  pool.query('SELECT * FROM tasks ORDER BY task_id ASC', (error, results) => {
    if (error) throw error;
    response.status(200).json(results.rows);
  })
};

const addTasks = (request, response) => {
  pool.query(`INSERT INTO tasks (task) VALUES ('${request.body.task}')`, (error, results) => {
    if (error) throw error;
    response.status(201).send(`Task ${request.body.task} added`);
  })
};

const updateTasks = (request, response) => {
  const id = parseInt(request.params.id);
  const { completed } = request.body;
  pool.query(`UPDATE tasks SET completed = ${completed} WHERE task_id = ${id}`, (error, results) => {
    if (error) throw error;
    response.status(200).send(`Task ${id} updated to ${completed}`);
  })
};

const deleteTasks = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(`DELETE from tasks WHERE task_id = ${id}`, (error, results) => {
    if (error) throw error;
    response.status(200).send(`Task ${id} deleted`);
  })
};

module.exports = {
  createUser,
  deleteUser,
  getTasks,
  addTasks,
  updateTasks,
  deleteTasks
};