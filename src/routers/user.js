const express = require('express');
const router = new express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const User = require('../models/user');

router.post('/user', async(req, res) => {
  try {
    const user = await User.create(req.body); 
    user.password = await bcrypt.hash(user.password, 8);
    await user.save();
    if (!req.body.token) await user.generateAuthToken();
    res.status(201).send({
      id: user.dataValues.id,
      name: user.dataValues.name,
      email: user.dataValues.email
    });
  } catch(e) {
    res.sendStatus(400);
  }
});

router.post('/user/login', async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findByCredentials(req.body.name, req.body.password);
    const token = await user.generateAuthToken();
    res.redirect('../task.html');
  } catch (e) {
    // res.sendStatus(400);
    console.log('log in failed');
    res.redirect('../index.html');
  }
});

router.post('/user/logout', auth, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.send();
  } catch (e) {
    res.sendStatus(500);
  }
});

router.patch('/user', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.sendStatus(400);

  try {
      if (updates.includes('password')) req.body.password = await bcrypt.hash(req.body.password, 8);

      await User.update({...req.body}, {
        where: {
          id: req.user.id
        }
      });

      res.send({
        id: req.user.id,
        name: req.body.name,
        email: req.body.email
      });
  } catch (e) {
    res.sendStatus(400);
  }
});

router.delete('/user', auth, async (req, res) => {
  try {
    await User.destroy({
      where: {
        name: req.user.name
      }
    });
    res.send();
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;