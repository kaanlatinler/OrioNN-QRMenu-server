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
      image: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
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
  Product.prototype.getTranslatedContent = function(language = 'tr') {
    if (this.translations && this.translations.length > 0) {
      const translation = this.translations.find(t => t.language === language);
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
