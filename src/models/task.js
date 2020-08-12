const {Sequelize, DataTypes, Deferrable, Model} = require('sequelize');
const sequelize = require('../db/postgres');
const User = require('./user');

class Task extends Model {}

Task.init({
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
},
{sequelize, tableName: 'tasks'});

sequelize.sync({alter: true}).then(function(err) {
  console.log('It worked!');
}, function (err) { 
  console.log('An error occurred while creating the table:', err);
});

module.exports = Task;