const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../db/postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User extends Model {
  static async findByCredentials(email, password) {
    const user = await User.findOne({email});
    if (!user) throw new Error('Unable to login.');
    // const isMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!password === user.dataValues.password) throw new Error('Unable to login.');
    return user;
  };

  static toJSON() {
    const user = this;
    return {
      id: user.dataValues.id,
      name: user.dataValues.name,
      email: user.dataValues.email,
      updatedAt: user.dataValues.updatedAt,
      createdAt: user.dataValues.createdAt
    };
  }

  async generateAuthToken() {
    const user = this;
    const token = jwt.sign({_id: user.id.toString()}, process.env.JWT_SECRET);
    user.tokens = token;
    await user.save();
    return token;
  }
}

// Sequelize will automatically add the columns id, createdAt and updatedAt.
User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
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
  // tokens: {
  //   type: DataTypes.STRING, 
  //   // allowNull: false
  // }
},
{sequelize, tableName: 'users'});

// create model
sequelize.sync({ force: true }).then(function(err) {
  console.log('It worked!');
}, function (err) { 
  console.log('An error occurred while creating the table:', err);
});

module.exports = User;