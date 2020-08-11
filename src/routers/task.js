const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.get('/tasks', auth, async (req, res) => {
  const task = new Task({...req.body, userId: req.user.id});
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.post('/tasks', db.addTasks);
// router.patch('/tasks/:id', db.updateTasks);
// router.delete('/tasks/:id', db.deleteTasks);

module.exports = router;