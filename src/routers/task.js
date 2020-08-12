const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
  try {
    const task = await Task.create({...req.body, userId: req.user.id});
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match = {};
  if (req.query.completed) match.completed = req.query.completed;

  let order = [];
  if (req.query.sortBy) {
    const sort = req.query.sortBy.split(':');
    order = [[sort[0], sort[1]? sort[1]: 'ASC']];
  }

  try {
    const tasks = await Task.findAll({
      where: {userId: req.user.id, ...match},
      attributes: ['id', 'task', 'completed'],
      order
    });
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
    return res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    await Task.destroy({where: {id: req.params.id}});
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;