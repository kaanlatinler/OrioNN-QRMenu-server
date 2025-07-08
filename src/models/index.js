const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User")(sequelize, DataTypes);
const Category = require("./Category")(sequelize, DataTypes);
const Product = require("./Product")(sequelize, DataTypes);
const Role = require("./Role")(sequelize, DataTypes);
const CategoryTranslation = require("./CategoryTranslation")(
  sequelize,
  DataTypes
);
const ProductTranslation = require("./ProductTranslation")(
  sequelize,
  DataTypes
);

const models = {
  User,
  Category,
  Product,
  Role,
  CategoryTranslation,
  ProductTranslation,
};

Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

// Normal sync - use reset-database.js script for complete database reset
sequelize.sync();

module.exports = {
  sequelize,
  ...models,
};
