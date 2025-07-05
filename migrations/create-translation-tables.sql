-- Create CategoryTranslation table
CREATE TABLE IF NOT EXISTS CategoryTranslations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoryId INT NOT NULL,
  language VARCHAR(5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_category_language (categoryId, language),
  FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE CASCADE
);

-- Create ProductTranslation table
CREATE TABLE IF NOT EXISTS ProductTranslations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  language VARCHAR(5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_product_language (productId, language),
  FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_category_translations_language ON CategoryTranslations(language);
CREATE INDEX idx_product_translations_language ON ProductTranslations(language); 