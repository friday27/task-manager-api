const {Sequelize, DataTypes, Deferrable} = require('sequelize');
const sequelize = require('../db/postgres');
const User = require('./user');

const Task = sequelize.define('Task', {
  task: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
      deferrable: Deferrable.INITIALLY_IMMEDIATE
    }
  }
}, {
  tableName: 'tasks'
});

sequelize.sync({ force: true }).then(function(err) {
  console.log('It worked!');
}, function (err) { 
  console.log('An error occurred while creating the table:', err);
});

module.exports = Task;