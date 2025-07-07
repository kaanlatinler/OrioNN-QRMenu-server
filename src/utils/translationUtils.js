const { CategoryTranslation, ProductTranslation } = require("../models");

// Helper function to get translated content for categories
const getCategoryTranslation = async (categoryId, language = "tr") => {
  try {
    const translation = await CategoryTranslation.findOne({
      where: {
        categoryId,
        language,
      },
    });
    return translation;
  } catch (error) {
    console.error("Error getting category translation:", error);
    return null;
  }
};

// Helper function to get translated content for products
const getProductTranslation = async (productId, language = "tr") => {
  try {
    const translation = await ProductTranslation.findOne({
      where: {
        productId,
        language,
      },
    });
    return translation;
  } catch (error) {
    console.error("Error getting product translation:", error);
    return null;
  }
};

// Helper function to save or update category translation
const saveCategoryTranslation = async (
  categoryId,
  language,
  title,
  description
) => {
  try {
    const [translation, created] = await CategoryTranslation.findOrCreate({
      where: {
        categoryId,
        language,
      },
      defaults: {
        title,
        description,
      },
    });

    if (!created) {
      await translation.update({
        title,
        description,
      });
    }

    return translation;
  } catch (error) {
    console.error("Error saving category translation:", error);
    throw error;
  }
};

// Helper function to save or update product translation
const saveProductTranslation = async (
  productId,
  language,
  title,
  description
) => {
  try {
    const [translation, created] = await ProductTranslation.findOrCreate({
      where: {
        productId,
        language,
      },
      defaults: {
        title,
        description,
      },
    });

    if (!created) {
      await translation.update({
        title,
        description,
      });
    }

    return translation;
  } catch (error) {
    console.error("Error saving product translation:", error);
    throw error;
  }
};

// Helper function to get all translations for a category
const getCategoryTranslations = async (categoryId) => {
  try {
    const translations = await CategoryTranslation.findAll({
      where: {
        categoryId,
      },
    });
    return translations;
  } catch (error) {
    console.error("Error getting category translations:", error);
    return [];
  }
};

// Helper function to get all translations for a product
const getProductTranslations = async (productId) => {
  try {
    const translations = await ProductTranslation.findAll({
      where: {
        productId,
      },
    });
    return translations;
  } catch (error) {
    console.error("Error getting product translations:", error);
    return [];
  }
};

// Helper function to format category with translations
const formatCategoryWithTranslations = (category, language = "tr") => {
  const translatedContent = category.getTranslatedContent(language);

  return {
    id: category.id,
    title: translatedContent.title,
    description: translatedContent.description,
    image: category.image,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    translations: category.translations || [],
    Products: category.Products
      ? category.Products.map((product) =>
          formatProductWithTranslations(product, language)
        )
      : [],
  };
};

// Helper function to format product with translations
const formatProductWithTranslations = (product, language = "tr") => {
  const translatedContent = product.getTranslatedContent(language);

  return {
    id: product.id,
    title: translatedContent.title,
    description: translatedContent.description,
    price: product.price,
    image: product.image,
    categoryId: product.categoryId,
    isActive: product.isActive,
    viewCount: product.viewCount || 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    translations: product.translations || [],
    Category: product.Category
      ? formatCategoryWithTranslations(product.Category, language)
      : null,
  };
};

module.exports = {
  getCategoryTranslation,
  getProductTranslation,
  saveCategoryTranslation,
  saveProductTranslation,
  getCategoryTranslations,
  getProductTranslations,
  formatCategoryWithTranslations,
  formatProductWithTranslations,
};
