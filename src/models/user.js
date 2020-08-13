const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../db/postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User extends Model {
  static async findByCredentials(name, password) {
    const user = await User.findAll({ 
      where: {
        name
      }
    });
    if (user.length === 0) throw new Error('Unable to login.');
    const isMatch = await bcrypt.compare(password, user[0].dataValues.password);
    if (!isMatch) throw new Error('Unable to login.');
    // if (!password === user.dataValues.password) throw new Error('Unable to login.');
    return user[0];
  };

  async generateAuthToken() {
    const user = this;
    const token = jwt.sign({id: user.id.toString()}, process.env.JWT_SECRET);
    user.token = token;
    await user.save();
    return token;
  };
}

// Sequelize will automatically add the columns id, createdAt and updatedAt.
User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type:DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  token: {
    type: DataTypes.STRING,
  }
},
{sequelize, tableName: 'users'});

// create model
sequelize.sync({alter: true}).then(function(err) {
  console.log('It worked!');
}, function (err) { 
  console.log('An error occurred while creating the table:', err);
});

module.exports = User;