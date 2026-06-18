-- Siréna MySQL schema
-- Create the database first, then run the CREATE TABLE statement.

CREATE DATABASE IF NOT EXISTS sirena CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sirena;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  originalPrice DECIMAL(10,2) DEFAULT NULL,
  category VARCHAR(80) DEFAULT NULL,
  description TEXT,
  longDescription TEXT,
  images JSON,
  sizes JSON,
  colors JSON,
  rating DECIMAL(3,2) DEFAULT 0,
  reviewCount INT DEFAULT 0,
  isNew BOOLEAN DEFAULT FALSE,
  isBestSeller BOOLEAN DEFAULT FALSE,
  isSale BOOLEAN DEFAULT FALSE,
  tags JSON,
  material VARCHAR(255) DEFAULT NULL,
  careInstructions JSON,
  shippingInfo TEXT,
  returnsPolicy TEXT,
  inventory JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
