const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({...req.body, userId: req.user.id});
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({where: {userId: req.user.id}});
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  //check if the update is allowed
  const updates = Object.keys(req.body);
  const allowedUpdates = ['task', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({error: 'Invalid updates!'});

  try {
    await Task.update({...req.body}, {
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    return res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.delete('/tasks/:id', db.deleteTasks);

module.exports = router;