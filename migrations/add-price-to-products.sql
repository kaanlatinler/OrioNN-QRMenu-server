-- Add price column to Products table
ALTER TABLE Products ADD COLUMN price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER description; 