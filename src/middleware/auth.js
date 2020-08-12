const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findAll({id: decoded.id, 'token': token});
    if (user.length === 0) throw new Error('User not found');
    // req.token = token;
    req.user = user[0];
    next();
  } catch (e) { 
    res.sendStatus(401);
  }
}

module.exports = auth;