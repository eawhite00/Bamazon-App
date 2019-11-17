-- Drop the DB if it exists, then create it --
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

-- Using the DB --
USE bamazon;

-- create products table --
CREATE TABLE products (

    id INTEGER(11) AUTO_INCREMENT NOT NULL,
  
    -- I want to prevent duplicate product names, so it's given the UNIQUE constraint. --
    product_name VARCHAR(80) UNIQUE NOT NULL,
 
    department_name VARCHAR(30) NOT NULL,

    price DECIMAL(10,2) NOT NULL,
  
    stock_quantity INT NOT NULL,

    PRIMARY KEY (id)
);

-- adding values into products table --
INSERT INTO products 
    (product_name, department_name, price, stock_quantity)
VALUES
    ("nintendo switch", "Electronics", 299.99, 20),
    ("Pokemon Sword", "Electronics", 59.99, 30),
    ("iPad", "Electronics", 799.99, 3),
    ("a cat", "Pets", 49.99, 1),
    ("Chair", "Home Decor", 19.99, 500),
    ("Cat bed", "Pets", 14.99, 25),
    ("Lamp", "Home Decor", 99.99, 37),
    ("A Different Lamp", "Home Decor", 109.99, 13),
    ("Pancakes", "food", 2.99, 10000),
    ("Maple Syrup", "food", 7.99, 500);