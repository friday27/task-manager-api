const Sequelize = require('sequelize');

const sequelize = new Sequelize('task-manager', process.env.PG_USER, process.env.PG_PASSWORD, {
  dialect: "postgres", // or 'sqlite', 'postgres', 'mariadb'
  host: process.env.PG_HOST,
  port: process.env.PG_PORT, // or 5432 (for postgres)
});

sequelize.authenticate().then(function(err) {
  console.log('Connection has been established successfully.');
}, function (err) { 
  console.log('Unable to connect to the database:', err);
});

module.exports = sequelize;