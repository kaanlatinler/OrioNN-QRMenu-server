module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.STRING,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "categories", // Explicitly set table name to lowercase
      timestamps: true,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: "categoryId",
    });
    Category.hasMany(models.CategoryTranslation, {
      foreignKey: "categoryId",
      as: "translations",
    });
  };

  // Instance method to get translated content
  Category.prototype.getTranslatedContent = function (language = "tr") {
    if (this.translations && this.translations.length > 0) {
      const translation = this.translations.find(
        (t) => t.language === language
      );
      if (translation) {
        return {
          title: translation.title,
          description: translation.description,
        };
      }
    }
    // Fallback to default content
    return {
      title: this.title,
      description: this.description,
    };
  };

  return Category;
};
