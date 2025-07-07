const { Category, Product, CategoryTranslation } = require("../models");
const {
  formatCategoryWithTranslations,
  saveCategoryTranslation,
} = require("../utils/translationUtils");

// Create new category
const createCategory = async (req, res) => {
  try {
    const { title, description } = req.body;
    let translations = req.body.translations;
    let image = null;

    // Handle file upload
    if (req.file) {
      // Generate URL pointing to client's public folder
      image = `/uploads/${req.file.filename}`;
    }

    // Parse translations if it's a JSON string
    if (translations && typeof translations === "string") {
      try {
        translations = JSON.parse(translations);
      } catch (parseError) {
        console.error("Error parsing translations JSON:", parseError);
        translations = null;
      }
    }

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Check if category with same title already exists
    const existingCategory = await Category.findOne({ where: { title } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this title already exists",
      });
    }

    // Create new category
    const category = await Category.create({
      title,
      description,
      image,
    });

    // Save translations if provided
    if (translations && typeof translations === "object") {
      for (const [language, translationData] of Object.entries(translations)) {
        if (translationData.title) {
          await saveCategoryTranslation(
            category.id,
            language,
            translationData.title,
            translationData.description
          );
        }
      }
    }

    // Get the created category with translations
    const categoryWithTranslations = await Category.findByPk(category.id, {
      include: [
        {
          model: CategoryTranslation,
          as: "translations",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: formatCategoryWithTranslations(categoryWithTranslations),
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, language = "tr" } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }

    // Get categories with pagination and translations
    const categories = await Category.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          as: "Products",
          attributes: ["id", "title", "isActive"],
          where: { isActive: true },
          required: false,
          include: [
            {
              model: require("../models").ProductTranslation,
              as: "translations",
            },
          ],
        },
        {
          model: CategoryTranslation,
          as: "translations",
        },
      ],
    });

    const totalPages = Math.ceil(categories.count / limit);

    // Format categories with translations
    const formattedCategories = categories.rows.map((category) =>
      formatCategoryWithTranslations(category, language)
    );

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: {
        categories: formattedCategories,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: categories.count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = "tr" } = req.query;

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Product,
          as: "Products",
          where: { isActive: true },
          required: false,
          include: [
            {
              model: require("../models").ProductTranslation,
              as: "translations",
            },
          ],
        },
        {
          model: CategoryTranslation,
          as: "translations",
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: formatCategoryWithTranslations(category, language),
    });
  } catch (error) {
    console.error("Get category by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get category by title (slug)
const getCategoryByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const { language = "tr" } = req.query;

    const category = await Category.findOne({
      where: { title },
      include: [
        {
          model: Product,
          as: "Products",
          where: { isActive: true },
          required: false,
          attributes: [
            "id",
            "title",
            "description",
            "price",
            "image",
            "isActive",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: require("../models").ProductTranslation,
              as: "translations",
            },
          ],
        },
        {
          model: CategoryTranslation,
          as: "translations",
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: formatCategoryWithTranslations(category, language),
    });
  } catch (error) {
    console.error("Get category by title error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isActive } = req.body;
    let translations = req.body.translations;
    let image = undefined;

    // Handle file upload
    if (req.file) {
      // Generate URL pointing to client's public folder
      image = `/uploads/${req.file.filename}`;
    }

    // Parse translations if it's a JSON string
    if (translations && typeof translations === "string") {
      try {
        translations = JSON.parse(translations);
      } catch (parseError) {
        console.error("Error parsing translations JSON:", parseError);
        translations = null;
      }
    }

    // Find category
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if title is being updated and if it already exists
    if (title && title !== category.title) {
      const existingCategory = await Category.findOne({
        where: {
          title,
          id: { [require("sequelize").Op.ne]: id },
        },
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this title already exists",
        });
      }
    }

    // Update category
    await category.update({
      title: title || category.title,
      description:
        description !== undefined ? description : category.description,
      image: image !== undefined ? image : category.image,
      isActive: isActive !== undefined ? isActive : category.isActive,
    });

    // Update translations if provided
    if (translations && typeof translations === "object") {
      for (const [language, translationData] of Object.entries(translations)) {
        if (translationData.title) {
          await saveCategoryTranslation(
            category.id,
            language,
            translationData.title,
            translationData.description
          );
        }
      }
    }

    // Get updated category with translations
    const updatedCategory = await Category.findByPk(id, {
      include: [
        {
          model: CategoryTranslation,
          as: "translations",
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: formatCategoryWithTranslations(updatedCategory),
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find category
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has products
    const productCount = await Product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with existing products",
      });
    }

    // Delete category
    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Soft delete category (deactivate)
const deactivateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find category
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Deactivate category
    await category.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Deactivate category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Activate category
const activateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find category
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Activate category
    await category.update({ isActive: true });

    res.status(200).json({
      success: true,
      message: "Category activated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Activate category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByTitle,
  updateCategory,
  deleteCategory,
  deactivateCategory,
  activateCategory,
};
