const dotenv = require("dotenv");
const dotenvConfig = require("dotenv").config();
const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize(
  "axesspoi_axp3_staging",
  "axesspoi_axp3_staging",
  "_K!p@Xpz-o[co{k)%W",
  {
    host: "173.248.143.156",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    operatorALiases: false,
    logging: false,
    // dialectOptions: {
    //      useUTC: false, // for reading from database
    //    },
    // timezone: '-8:00',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
