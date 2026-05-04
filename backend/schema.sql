CREATE DATABASE IF NOT EXISTS flavourbook_app;
USE flavourbook_app;

CREATE TABLE IF NOT EXISTS User (
    User_id INT AUTO_INCREMENT PRIMARY KEY,
    First_name VARCHAR(50) NOT NULL,
    Middle_name VARCHAR(50),
    Last_name VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Date_of_Birth DATE
);

CREATE TABLE IF NOT EXISTS Category (
    Category_id INT AUTO_INCREMENT PRIMARY KEY,
    Category_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipe (
    Recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    Recipe_name VARCHAR(100) NOT NULL,
    Cooking_time INT COMMENT 'Time in minutes',
    Difficulty_level ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    Description TEXT,
    User_id INT,
    Category_id INT,
    FOREIGN KEY (User_id) REFERENCES User(User_id) ON DELETE SET NULL,
    FOREIGN KEY (Category_id) REFERENCES Category(Category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Ingredients (
    Ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    Ingredient_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipe_Ingredient (
    Recipe_id INT,
    Ingredient_id INT,
    Quantity VARCHAR(50),
    PRIMARY KEY (Recipe_id, Ingredient_id),
    FOREIGN KEY (Recipe_id) REFERENCES Recipe(Recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (Ingredient_id) REFERENCES Ingredients(Ingredient_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Review (
    Review_id INT AUTO_INCREMENT PRIMARY KEY,
    Review_text TEXT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Review_date DATE,
    User_id INT,
    Recipe_id INT,
    FOREIGN KEY (User_id) REFERENCES User(User_id) ON DELETE CASCADE,
    FOREIGN KEY (Recipe_id) REFERENCES Recipe(Recipe_id) ON DELETE CASCADE
);

-- Insert dummy data for initialization
INSERT IGNORE INTO User (First_name, Last_name, Email) VALUES 
('Admin', 'User', 'admin@flavourbook.com');

INSERT IGNORE INTO Category (Category_name) VALUES 
('Breakfast'), ('Lunch'), ('Dinner'), ('Dessert'), ('Beverage'), ('Snack');

INSERT IGNORE INTO Ingredients (Ingredient_name) VALUES 
('Tomato'), ('Onion'), ('Garlic'), ('Chicken'), ('Beef'), ('Salt'), ('Pepper'), ('Olive Oil'), ('Pasta'), ('Cheese');
