require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: "rabbit-liquor-v2.ccpmusoqm6s0.us-east-1.rds.amazonaws.com",
  port: 5432,
  database: "postgres",
  user: "postgres", // use your actual RDS username
  password: "Rabbit167216",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
