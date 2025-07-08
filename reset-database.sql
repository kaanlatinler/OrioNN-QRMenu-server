-- Reset Database Script
-- Run this script in your MySQL database to clear all tables and constraints

-- First, let's see what tables exist
SELECT 'Current tables in database:' as info;
SHOW TABLES;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables with lowercase names (Sequelize default)
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categorytranslations`;
DROP TABLE IF EXISTS `producttranslations`;

-- Drop all tables with uppercase names (in case they exist)
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `Roles`;
DROP TABLE IF EXISTS `Categories`;
DROP TABLE IF EXISTS `Products`;
DROP TABLE IF EXISTS `CategoryTranslations`;
DROP TABLE IF EXISTS `ProductTranslations`;

-- Drop any other tables that might exist (adjust database name as needed)
-- Replace 'your_database_name' with your actual database name
-- DROP TABLE IF EXISTS `your_database_name`.`sequelizemeta`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify all tables are dropped
SELECT 'Tables after cleanup:' as info;
SHOW TABLES; 