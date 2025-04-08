const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Visitor = require("./Visitor")(sequelize, DataTypes);

module.exports = {
  Visitor,
};
