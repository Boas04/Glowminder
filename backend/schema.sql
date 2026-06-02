-- Glowminder Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS glowminder;
USE glowminder;

-- Categories Table
CREATE TABLE IF NOT EXISTS products_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  usage_time ENUM('morning', 'night', 'special_treatment'),
  description TEXT,
  ingredients TEXT,
  category_id INT,
  brand_id INT,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES products_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_brand (brand_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data

-- Insert Categories
INSERT INTO products_categories (name) VALUES
('cleanser'),
('toner'),
('serum'),
('moisturizer'),
('sunscreen'),
('eye_cream'),
('mask'),
('exfoliator'),
('treatment');

-- Insert Brands
INSERT INTO brands (name, country) VALUES
('Cetaphil', 'USA'),
('COSRX', 'South Korea'),
('Ordinary', 'Canada'),
('La Roche Posay', 'France'),
('Olay', 'USA'),
('Neutrogena', 'USA'),
('Kiehl\'s', 'USA'),
('Shiseido', 'Japan'),
('Clinique', 'USA'),
('Bioderma', 'France');

-- Insert Sample Products
INSERT INTO products (name, usage_time, description, ingredients, category_id, brand_id, in_stock) VALUES
('Cetaphil Gentle Skin Cleanser', 'morning', 'Gentle cleanser untuk semua tipe kulit', 'Water, Cetyl Alcohol, Propylene Glycol', 1, 1, TRUE),
('COSRX Advanced Snail 96 Mucin Power Essence', 'morning', 'Hydrating essence dengan snail mucin', 'Snail Secretion Filtrate, Butylene Glycol', 3, 2, TRUE),
('The Ordinary Niacinamide 10% + Zinc 1%', 'morning', 'Serum untuk sebum control', 'Aqua, Niacinamide, Zinc PCA', 3, 3, TRUE),
('La Roche Posay Anthelios SPF 60', 'morning', 'Daily sunscreen protection', 'Avobenzone, Octinoxate, Titanium Dioxide', 5, 4, TRUE),
('Olay Regenerist Retinol24 Night Moisturizer', 'night', 'Anti-aging night moisturizer', 'Water, Retinol, Glycerin', 4, 5, TRUE),
('Neutrogena Hydro Boost Hydrating Toner', 'morning', 'Hydrating toner dengan hyaluronic acid', 'Water, Hyaluronic Acid', 2, 6, TRUE),
('Kiehl\'s Eye Cream', 'night', 'Eye area treatment', 'Water, Petrolatum, Lanolin', 6, 7, TRUE),
('Shiseido Essential Energy Mask', 'special_treatment', 'Weekly hydrating mask', 'Water, Glycerin, Ceramides', 7, 8, TRUE),
('Clinique Dramatically Different Moisturizing Lotion', 'night', 'Universal moisturizer', 'Water, Squalane, Glycerin', 4, 9, TRUE),
('Bioderma Sensibio H2O Micellar Water', 'morning', 'Gentle micellar cleanser', 'Water, Micellar solution', 1, 10, TRUE);
