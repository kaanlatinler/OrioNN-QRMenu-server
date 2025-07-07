-- Add viewCount column to Products table
ALTER TABLE Products ADD COLUMN viewCount INT DEFAULT 0 NOT NULL;

-- Add index for better performance on view count queries
CREATE INDEX idx_products_view_count ON Products(viewCount); 