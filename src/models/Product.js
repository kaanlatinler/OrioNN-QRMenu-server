module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
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
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      image: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "categories", // Use lowercase table name
          key: "id",
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "products", // Explicitly set table name to lowercase
      timestamps: true,
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
    });
    Product.hasMany(models.ProductTranslation, {
      foreignKey: "productId",
      as: "translations",
    });
  };

  // Instance method to get translated content
  Product.prototype.getTranslatedContent = function (language = "tr") {
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

  return Product;
};
