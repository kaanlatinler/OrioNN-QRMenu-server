const { Product, Category, ProductTranslation } = require("../models");
const {
  formatProductWithTranslations,
  saveProductTranslation,
} = require("../utils/translationUtils");

// Create new product
const createProduct = async (req, res) => {
  try {
    const { title, description, price, categoryId } = req.body;
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

    // Validate price
    if (price === undefined || price === null || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price is required and must be non-negative",
      });
    }

    // Validate category if provided
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
      if (!category.isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot assign product to inactive category",
        });
      }
    }

    // Create new product
    const product = await Product.create({
      title,
      description,
      price: parseFloat(price),
      image,
      categoryId,
    });

    // Save translations if provided
    if (translations && typeof translations === "object") {
      for (const [language, translationData] of Object.entries(translations)) {
        if (translationData.title) {
          await saveProductTranslation(
            product.id,
            language,
            translationData.title,
            translationData.description
          );
        }
      }
    }

    // Get the created product with translations
    const productWithTranslations = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: "Category",
          attributes: ["id", "title", "isActive"],
        },
        {
          model: ProductTranslation,
          as: "translations",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: formatProductWithTranslations(productWithTranslations),
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      isActive,
      categoryId,
      search,
      sortBy = "createdAt",
      sortOrder = "DESC",
      language = "tr",
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    if (search) {
      whereClause[require("sequelize").Op.or] = [
        { title: { [require("sequelize").Op.like]: `%${search}%` } },
        { description: { [require("sequelize").Op.like]: `%${search}%` } },
      ];
    }

    // Validate sort parameters
    const allowedSortFields = ["title", "createdAt", "updatedAt"];
    const allowedSortOrders = ["ASC", "DESC"];

    const finalSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";
    const finalSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    // Get products with pagination and translations
    const products = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[finalSortBy, finalSortOrder]],
      include: [
        {
          model: Category,
          as: "Category",
          attributes: ["id", "title", "isActive"],
          where: { isActive: true },
          required: false,
        },
        {
          model: ProductTranslation,
          as: "translations",
        },
      ],
    });

    const totalPages = Math.ceil(products.count / limit);

    // Format products with translations
    const formattedProducts = products.rows.map((product) =>
      formatProductWithTranslations(product, language)
    );

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: {
        products: formattedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: products.count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = "tr" } = req.query;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "Category",
          attributes: ["id", "title", "description", "image", "isActive"],
        },
        {
          model: ProductTranslation,
          as: "translations",
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: formatProductWithTranslations(product, language),
    });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, categoryId, isActive } = req.body;
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

    // Find product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Validate price if provided
    if (price !== undefined && price !== null && price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be non-negative",
      });
    }

    // Validate category if provided
    if (categoryId && categoryId !== product.categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
      if (!category.isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot assign product to inactive category",
        });
      }
    }

    // Update product
    await product.update({
      title: title !== undefined ? title : product.title,
      description:
        description !== undefined ? description : product.description,
      price: price !== undefined ? parseFloat(price) : product.price,
      image: image !== undefined ? image : product.image,
      categoryId: categoryId !== undefined ? categoryId : product.categoryId,
      isActive: isActive !== undefined ? isActive : product.isActive,
    });

    // Update translations if provided
    if (translations && typeof translations === "object") {
      for (const [language, translationData] of Object.entries(translations)) {
        if (translationData.title) {
          await saveProductTranslation(
            product.id,
            language,
            translationData.title,
            translationData.description
          );
        }
      }
    }

    // Get updated product with translations
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "Category",
          attributes: ["id", "title", "isActive"],
        },
        {
          model: ProductTranslation,
          as: "translations",
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: formatProductWithTranslations(updatedProduct),
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete product
    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Soft delete product (deactivate)
const deactivateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Deactivate product
    await product.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Deactivate product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Activate product
const activateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Activate product
    await product.update({ isActive: true });

    res.status(200).json({
      success: true,
      message: "Product activated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Activate product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, isActive } = req.query;
    const offset = (page - 1) * limit;

    // Validate category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Build where clause
    const whereClause = { categoryId };
    if (isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }

    // Get products by category
    const products = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Category,
          as: "Category",
          attributes: ["id", "title", "isActive"],
        },
      ],
    });

    const totalPages = Math.ceil(products.count / limit);

    res.status(200).json({
      success: true,
      message: "Products by category retrieved successfully",
      data: {
        category: {
          id: category.id,
          title: category.title,
          description: category.description,
          image: category.image,
        },
        products: products.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: products.count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Increment product view count
const incrementProductView = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count
    await product.increment("viewCount");

    res.status(200).json({
      success: true,
      message: "View count incremented successfully",
      data: {
        productId: product.id,
        viewCount: product.viewCount + 1,
      },
    });
  } catch (error) {
    console.error("Increment product view error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deactivateProduct,
  activateProduct,
  getProductsByCategory,
  incrementProductView,
};
