const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "chatapp_db",     // database name
  "root",           // mysql username
  "root",       // mysql password
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = sequelize;