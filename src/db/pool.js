const Pool = require('pg').Pool;

const databaseConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

const pool = new Pool(databaseConfig);

module.exports = pool;