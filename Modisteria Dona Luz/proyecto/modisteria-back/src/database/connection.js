require('dotenv').config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.CONNECT_DB, {
  dialect: process.env.DIALECT_DB || 'postgres',
  logging: false,
});

const connection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Se sincronizo de manera correcta");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { connection, sequelize };
