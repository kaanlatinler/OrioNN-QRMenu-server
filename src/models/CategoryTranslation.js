module.exports = (sequelize, DataTypes) => {
  const CategoryTranslation = sequelize.define(
    "CategoryTranslation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
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
          fields: ["categoryId", "language"],
        },
      ],
    }
  );

  CategoryTranslation.associate = (models) => {
    CategoryTranslation.belongsTo(models.Category, {
      foreignKey: "categoryId",
      onDelete: "CASCADE",
    });
  };

  return CategoryTranslation;
};
