module.exports = (sequelize, DataTypes) => {
  const ProductTranslation = sequelize.define(
    "ProductTranslation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
      },
      language: {
        type: DataTypes.STRING(5), // 'tr', 'en', 'ru'
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["productId", "language"],
        },
      ],
    }
  );

  ProductTranslation.associate = (models) => {
    ProductTranslation.belongsTo(models.Product, {
      foreignKey: "productId",
      onDelete: "CASCADE",
    });
  };

  return ProductTranslation;
};
