CREATE DATABASE flavourbook;
USE flavourbook;
CREATE TABLE Users(
UserID INT PRIMARY KEY AUTO_INCREMENT,
Name VARCHAR(50),
Email VARCHAR(100),
Password VARCHAR(100)
);

CREATE TABLE Recipes(
RecipeID INT PRIMARY KEY AUTO_INCREMENT,
RecipeName VARCHAR(100),
Category VARCHAR(50),
PrepTime INT,
Instructions TEXT,
UserID INT,
FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Ingredients(
IngredientID INT PRIMARY KEY AUTO_INCREMENT,
IngredientName VARCHAR(100)
);

CREATE TABLE RecipeIngredients(
RecipeID INT,
IngredientID INT,
Quantity VARCHAR(50),
PRIMARY KEY (RecipeID, IngredientID)
);
INSERT INTO Users(Name,Email,Password)
VALUES
('Rahyan','rahyan@email.com','123'),
('Avani','avani@email.com','123');

INSERT INTO Recipes(RecipeName,Category,PrepTime,Instructions,UserID)
VALUES
('Pasta','Italian',20,'Boil pasta and add sauce',1),
('Paneer Butter Masala','Indian',30,'Cook paneer with gravy',2);
SELECT * FROM Recipes;
UPDATE Recipes
SET PrepTime = 25
WHERE RecipeID = 1;
DELETE FROM Recipes
WHERE RecipeID = 2;
SELECT * FROM Recipes;
SELECT RecipeName, Category
FROM Recipes;
SELECT * FROM Recipes
WHERE PrepTime > 20;
SELECT COUNT(*) FROM Recipes;
INSERT INTO Recipes(RecipeName,Category,PrepTime,UserID)
VALUES
('Paneer Butter Masala','Indian',30,2);
SELECT AVG(PrepTime) FROM Recipes;
SELECT MAX(PrepTime) FROM Recipes;
SELECT MIN(PrepTime) FROM Recipes;
SELECT Recipes.RecipeName, Users.Name
FROM Recipes
INNER JOIN Users
ON Recipes.UserID = Users.UserID;
SELECT Users.Name, Recipes.RecipeName
FROM Users
LEFT JOIN Recipes
ON Users.UserID = Recipes.UserID;
SELECT * FROM Recipes
WHERE PrepTime > (
SELECT AVG(PrepTime) FROM Recipes
);
CREATE VIEW QuickRecipes AS
SELECT RecipeName, PrepTime
FROM Recipes
WHERE PrepTime < 30;
SELECT * FROM QuickRecipes;
SELECT Name FROM Users
UNION
SELECT RecipeName FROM Recipes;
START TRANSACTION;

UPDATE Recipes
SET PrepTime = 35
WHERE RecipeID = 1;

ROLLBACK;
DELIMITER $$

CREATE TRIGGER check_prep_time
BEFORE INSERT ON Recipes
FOR EACH ROW
BEGIN
IF NEW.PrepTime < 5 THEN
SET NEW.PrepTime = 5;
END IF;
END$$

DELIMITER ;
SELECT Category, COUNT(*) AS TotalRecipes
FROM Recipes
GROUP BY Category
HAVING COUNT(*) >= 1;
ALTER TABLE Review
ADD CONSTRAINT chk_rating
CHECK (Rating BETWEEN 1 AND 5);

SELECT Review_id, Rating
FROM Review
WHERE Rating BETWEEN 1 AND 5;
SHOW TABLES;
CREATE TABLE Review (
    Review_id INT PRIMARY KEY AUTO_INCREMENT,
    Review_text VARCHAR(255),
    Rating INT,
    Review_date DATE,
    User_id INT,
    Recipe_id INT
);
ALTER TABLE Review
ADD CONSTRAINT chk_rating
CHECK (Rating BETWEEN 1 AND 5);
INSERT INTO Review (Review_text, Rating, Review_date, User_id, Recipe_id)
VALUES ('Great recipe!', 5, '2024-01-01', 1, 1);
SELECT Review_id, Rating
FROM Review
WHERE Rating BETWEEN 1 AND 5;
SELECT c.Category_name, COUNT(r.Recipe_id) AS Total_Recipes
FROM Recipe r
JOIN Category c ON r.Category_id = c.Category_id
GROUP BY c.Category_name;
SELECT q.recipe_name, COUNT(r.recipe_id) AS Total_Recipes
FROM quickrecipes q
JOIN recipes r ON q.recipe_id = r.recipe_id
GROUP BY q.recipe_name;
DESC quickrecipes;
SELECT RecipeName, COUNT(*) AS Total
FROM quickrecipes
GROUP BY RecipeName;
INSERT INTO quickrecipes VALUES ('Maggi', 5);
INSERT INTO quickrecipes VALUES ('Sandwich', 10);
INSERT INTO quickrecipes VALUES ('Pasta', 15);
SELECT Recipe_name FROM recipes
UNION
SELECT RecipeName FROM quickrecipes;
DESC recipes;
SELECT RecipeName FROM recipes
UNION
SELECT RecipeName FROM quickrecipes;
SELECT RecipeName
FROM recipes
WHERE RecipeID IN
(
    SELECT Recipe_id
    FROM review
    WHERE Rating = 5
);
DESC users;
SELECT r.RecipeName, r.Category, u.Name
FROM recipes r
JOIN users u
ON r.UserID = u.UserId;
CREATE VIEW Recipe_View AS
SELECT r.RecipeName, r.Category, r.PrepTime, u.Name
FROM recipes r
JOIN users u
ON r.UserID = u.UserId;
SELECT * FROM Recipe_View;
CREATE TABLE recipe_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    RecipeID INT,
    RecipeName VARCHAR(100),
    log_time TIMESTAMP
);
DROP TABLE recipe_log;

CREATE TABLE recipe_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    RecipeID INT,
    RecipeName VARCHAR(100),
    log_time TIMESTAMP
);

DROP TRIGGER IF EXISTS recipe_insert_trigger;

DELIMITER //
CREATE TRIGGER recipe_insert_trigger
AFTER INSERT ON recipes
FOR EACH ROW
BEGIN
INSERT INTO recipe_log (RecipeID, RecipeName, log_time)
VALUES (NEW.RecipeID, NEW.RecipeName, NOW());
END //
DELIMITER ;
INSERT INTO recipes (RecipeName, Category, PrepTime, Instructions, UserID)
VALUES ('Soup', 'Healthy', 15, 'Boil ingredients', 1);
SELECT * FROM recipe_log;
ALTER TABLE recipes
ADD Difficulty VARCHAR(20);
UPDATE recipes
SET Difficulty = NULL
WHERE RecipeID IN (1,2);

DELIMITER //
CREATE PROCEDURE UpdateRecipeDifficulty()
BEGIN
DECLARE done INT DEFAULT 0;
DECLARE r_id INT;
-- Cursor
DECLARE cur CURSOR FOR
SELECT RecipeID FROM recipes WHERE Difficulty IS NULL;
-- Handler
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
OPEN cur;
read_loop: LOOP
FETCH cur INTO r_id;
IF done THEN
LEAVE read_loop;
END IF;
UPDATE recipes
SET Difficulty = 'Medium'
WHERE RecipeID = r_id;
END LOOP;
CLOSE cur;
END //
DELIMITER ;
CALL UpdateRecipeDifficulty();
SELECT RecipeID, RecipeName, Difficulty FROM recipes;
SHOW TABLES;
INSERT INTO recipes (RecipeName, Category, PrepTime, Instructions, UserID)
VALUES ('Bread Toast', 'Breakfast', 5, 'Toast bread', 1);
DESC review_log;
DROP TABLE review_log;
CREATE TABLE review_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    RecipeID INT,
    OldRating INT,
    NewRating INT,
    log_time TIMESTAMP
);
DROP TRIGGER IF EXISTS review_update_trigger;

-- reviewchapter3--
-- 3.1 --
-- Q1 --
ALTER TABLE Review
ADD CONSTRAINT chk_rating
CHECK (Rating BETWEEN 1 AND 5);
SELECT Review_id, Rating
FROM Review
WHERE Rating BETWEEN 1 AND 5;
DESC recipes;
-- end --
-- Q2 --
ALTER TABLE recipes
ADD CONSTRAINT chk_prep_time
CHECK (PrepTime > 0);

SELECT RecipeName, PrepTime
FROM recipes
WHERE PrepTime > 0;
-- end --
-- Q3 --
SELECT DISTINCT Category
FROM recipes;
-- end --
-- 3.2 --
-- Q1 --
SELECT RecipeName, COUNT(*) AS Total
FROM quickrecipes
GROUP BY RecipeName;
-- end --
-- Q2 --
SELECT Category, COUNT(*) AS Total_Recipes
FROM recipes
WHERE Category IS NOT NULL
GROUP BY Category;
-- end --
-- Q3 --
SELECT Recipe_id, AVG(Rating) AS Avg_Rating
FROM review
GROUP BY Recipe_id;
-- end --
-- 3.3 --
-- Q1 --
SELECT RecipeName FROM recipes
UNION
SELECT RecipeName FROM quickrecipes;
-- end --
-- Q2 --
SELECT RecipeName FROM recipes
WHERE RecipeName IN (
    SELECT RecipeName FROM quickrecipes
);
-- end --
-- Q3 --
SELECT RecipeName FROM recipes
WHERE RecipeName NOT IN (
    SELECT RecipeName FROM quickrecipes
);
-- end --
-- 3.4 --
-- Q1 --
SELECT RecipeName
FROM recipes
WHERE RecipeID IN (
    SELECT Recipe_id
    FROM review
    WHERE Rating = 5
);
-- end --
-- Q2 --
SELECT RecipeName, PrepTime
FROM recipes
WHERE PrepTime > (
    SELECT AVG(PrepTime)
    FROM recipes
);
-- end --
-- Q3 --
SELECT Name
FROM users
WHERE UserID IN (
    SELECT UserID
    FROM recipes
);
-- end --
-- 3.5 --
-- Q1 --
SELECT r.RecipeName, r.Category, u.Name
FROM recipes r
JOIN users u
ON r.UserID = u.UserId; 
-- end --
-- Q2 --
SELECT r.RecipeName, rv.Rating
FROM recipes r
JOIN review rv
ON r.RecipeID = rv.Recipe_id;
-- end --
-- Q3 --
SELECT r.RecipeName, rv.Rating
FROM recipes r
LEFT JOIN review rv
ON r.RecipeID = rv.Recipe_id;
-- end --
-- 3.6 --
-- Q1 --
CREATE VIEW recipe_user_view AS
SELECT r.RecipeName, r.Category, r.PrepTime, u.Name
FROM recipes r
JOIN users u
ON r.UserID = u.UserID;
SELECT * FROM recipe_user_view;
-- end --
-- Q2 --
CREATE VIEW recipe_rating_view AS
SELECT r.RecipeName, rv.Rating
FROM recipes r
JOIN review rv
ON r.RecipeID = rv.Recipe_id;
SELECT * FROM recipe_rating_view;
-- end --
-- Q3 --
CREATE VIEW full_recipe_view AS
SELECT r.RecipeName, r.Category, r.PrepTime, u.Name, rv.Rating
FROM recipes r
JOIN users u ON r.UserID = u.UserID
LEFT JOIN review rv ON r.RecipeID = rv.Recipe_id;
SELECT * FROM full_recipe_view;
-- end --
-- 
CREATE TABLE IF NOT EXISTS recipe_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    RecipeID INT,
    RecipeName VARCHAR(100),
    log_time TIMESTAMP
);
DROP TRIGGER IF EXISTS recipe_insert_trigger;
--
-- 3.7 --
-- Q1 --
DELIMITER //
CREATE TRIGGER recipe_insert_trigger
AFTER INSERT ON recipes
FOR EACH ROW
BEGIN
INSERT INTO recipe_log (RecipeID, RecipeName, log_time)
VALUES (NEW.RecipeID, NEW.RecipeName, NOW());
END //
DELIMITER ;
INSERT INTO recipes (RecipeName, Category, PrepTime, Instructions, UserID)
VALUES ('Soup', 'Healthy', 15, 'Boil ingredients', 1);
SELECT * FROM recipe_log;
-- end --
--
CREATE TABLE IF NOT EXISTS review_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    RecipeID INT,
    OldRating INT,
    NewRating INT,
    log_time TIMESTAMP
);
-- wait
SELECT * FROM review;
INSERT INTO review (Review_text, Rating, Review_date, User_id, Recipe_id)
VALUES ('Test review', 4, '2026-03-10', 1, 1);

--
-- Q2 --
DELIMITER //
CREATE TRIGGER review_update_trigger
AFTER UPDATE ON review
FOR EACH ROW
BEGIN
INSERT INTO review_log (RecipeID, OldRating, NewRating, log_time)
VALUES (OLD.Recipe_id, OLD.Rating, NEW.Rating, NOW());
END //
DELIMITER ;
UPDATE review
SET Rating = 3
WHERE Review_id = 2;
SELECT * FROM review_log;
-- end --
--
DROP TRIGGER IF EXISTS recipe_before_insert;
--
-- Q3 --
DELIMITER //
CREATE TRIGGER recipe_before_insert
BEFORE INSERT ON recipes
FOR EACH ROW
BEGIN
IF NEW.PrepTime IS NULL OR NEW.PrepTime <= 0 THEN
SET NEW.PrepTime = 10;
END IF;
END //
DELIMITER ;
INSERT INTO recipes (RecipeName, Category, PrepTime, Instructions, UserID)
VALUES ('Test Recipe', 'General', NULL, 'Test', 1);
SELECT * FROM recipes;
-- end --
-- 3.8 --
--
UPDATE recipes
SET Difficulty = NULL
WHERE RecipeID IN (2,3);
SELECT RecipeID, RecipeName, Difficulty FROM recipes;
--
-- Q1 --
DELIMITER //
CREATE PROCEDURE update_null_difficulty()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE r_id INT;
    DECLARE cur CURSOR FOR
    SELECT RecipeID FROM recipes WHERE Difficulty IS NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO r_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        UPDATE recipes
        SET Difficulty = 'Medium'
        WHERE RecipeID = r_id;
    END LOOP;
    CLOSE cur;
END //
DELIMITER ;
CALL update_null_difficulty();
SELECT RecipeID, RecipeName, Difficulty FROM recipes;
-- end --
--
UPDATE recipes
SET PrepTime = 3
WHERE RecipeID IN (2,3);
SELECT RecipeID, RecipeName, PrepTime FROM recipes;
--
-- Q2 --
DELIMITER //
CREATE PROCEDURE update_prep_time()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE r_id INT;
    DECLARE cur CURSOR FOR
    SELECT RecipeID FROM recipes WHERE PrepTime < 5;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO r_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        UPDATE recipes
        SET PrepTime = 5
        WHERE RecipeID = r_id;
    END LOOP;
    CLOSE cur;
END //
DELIMITER ;
CALL update_prep_time();
SELECT RecipeID, RecipeName, PrepTime FROM recipes;
-- end --
--
UPDATE recipes
SET RecipeName = 'Pasta' WHERE RecipeID = 1;
UPDATE recipes
SET RecipeName = 'Maggi' WHERE RecipeID = 2;
UPDATE recipes
SET RecipeName = 'Sandwich' WHERE RecipeID = 3;
SELECT RecipeID, RecipeName FROM recipes;
--
-- Q3--
DELIMITER //
CREATE PROCEDURE uppercase_recipe_names()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE r_id INT;
    DECLARE cur CURSOR FOR
    SELECT RecipeID FROM recipes;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO r_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        UPDATE recipes
        SET RecipeName = UPPER(RecipeName)
        WHERE RecipeID = r_id;
    END LOOP;
    CLOSE cur;
END //
DELIMITER ;
CALL uppercase_recipe_names();
SELECT RecipeID, RecipeName FROM recipes;
-- end --
-- chapter 4 --
-- unnormalized --
CREATE TABLE RecipeDetails(
RecipeID INT,
RecipeName VARCHAR(100),
UserName VARCHAR(50),
Ingredient1 VARCHAR(50),
Ingredient2 VARCHAR(50),
Ingredient3 VARCHAR(50),
PrepTime INT
);
INSERT INTO RecipeDetails VALUES
(1,'Pasta','Rahyan','Tomato','Salt','Cheese',20),
(2,'Paneer Butter Masala','Avani','Paneer','Butter','Spices',30);
SELECT * FROM RecipeDetails;
-- 4.1 --
CREATE TABLE Recipe_1NF(
RecipeID INT,
RecipeName VARCHAR(100),
Ingredient VARCHAR(50),
PrepTime INT
);
INSERT INTO Recipe_1NF VALUES
(1,'Pasta','Tomato',20),
(1,'Pasta','Salt',20),
(1,'Pasta','Cheese',20),
(2,'Paneer Butter Masala','Paneer',30),
(2,'Paneer Butter Masala','Butter',30),
(2,'Paneer Butter Masala','Spices',30);
SELECT * FROM Recipe_1NF;

-- 4.2 --
CREATE TABLE Recipes_2NF(
RecipeID INT PRIMARY KEY,
RecipeName VARCHAR(100),
PrepTime INT
);

CREATE TABLE RecipeIngredients_2NF(
RecipeID INT,
Ingredient VARCHAR(50),
PRIMARY KEY (RecipeID, Ingredient)
);
INSERT INTO Recipes_2NF VALUES
(1,'Pasta',20),
(2,'Paneer Butter Masala',30);

INSERT INTO RecipeIngredients_2NF VALUES
(1,'Tomato'),
(1,'Salt'),
(1,'Cheese'),
(2,'Paneer'),
(2,'Butter'),
(2,'Spices');
SELECT * FROM Recipes_2NF;
SELECT * FROM RecipeIngredients_2NF;

-- 4.3 --
CREATE TABLE Users_3NF(
UserID INT PRIMARY KEY,
Name VARCHAR(50)
);

CREATE TABLE Recipes_3NF(
RecipeID INT PRIMARY KEY,
RecipeName VARCHAR(100),
PrepTime INT,
UserID INT,
FOREIGN KEY (UserID) REFERENCES Users_3NF(UserID)
);
INSERT INTO Users_3NF VALUES
(1,'Rahyan'),
(2,'Avani');

INSERT INTO Recipes_3NF VALUES
(1,'Pasta',20,1),
(2,'Paneer Butter Masala',30,2);
SELECT * FROM Users_3NF;
SELECT * FROM Recipes_3NF;
SELECT Recipes_3NF.RecipeName, Users_3NF.Name
FROM Recipes_3NF
INNER JOIN Users_3NF
ON Recipes_3NF.UserID = Users_3NF.UserID;

-- 4.3 --
CREATE TABLE Ingredients_BCNF(
IngredientID INT PRIMARY KEY,
IngredientName VARCHAR(50)
);
CREATE TABLE Suppliers_BCNF(
IngredientName VARCHAR(50),
Supplier VARCHAR(50)
);
INSERT INTO Ingredients_BCNF VALUES
(1,'Tomato'),
(2,'Paneer'),
(3,'Butter');
INSERT INTO Suppliers_BCNF VALUES
('Tomato','Local Market'),
('Paneer','Dairy Farm'),
('Butter','Dairy Farm');
SELECT * FROM Ingredients_BCNF;

-- 4.4 --
CREATE TABLE RecipeIngredients_4NF(
RecipeID INT,
Ingredient VARCHAR(50)
);
CREATE TABLE RecipeTags_4NF(
RecipeID INT,
Tag VARCHAR(50)
);
INSERT INTO RecipeIngredients_4NF VALUES
(1,'Tomato'),
(1,'Salt'),
(1,'Cheese'),
(2,'Paneer'),
(2,'Butter');
INSERT INTO RecipeTags_4NF VALUES
(1,'Italian'),
(1,'Quick'),
(2,'Indian'),
(2,'Spicy');
SELECT * FROM RecipeIngredients_4NF;
SELECT * FROM RecipeTags_4NF;

-- 4.5 --
CREATE TABLE RecipeChef(
RecipeID INT,
ChefID INT
);
CREATE TABLE ChefRestaurant(
ChefID INT,
RestaurantID INT
);
CREATE TABLE RecipeRestaurant(
RecipeID INT,
RestaurantID INT
);
INSERT INTO RecipeChef VALUES
(1,101),
(2,102);
INSERT INTO ChefRestaurant VALUES
(101,201),
(102,202);
INSERT INTO RecipeRestaurant VALUES
(1,201),
(2,202);
SELECT * FROM RecipeChef;
SELECT * FROM ChefRestaurant;
SELECT * FROM RecipeRestaurant;

-- chapter 5 --
-- 5.3.1 --
START TRANSACTION;
UPDATE Recipes
SET PrepTime = PrepTime + 5
WHERE RecipeID = 1;
SAVEPOINT sp1;
UPDATE Recipes
SET PrepTime = PrepTime + 10
WHERE RecipeID = 2;
ROLLBACK TO sp1;
UPDATE Recipes
SET PrepTime = PrepTime + 2
WHERE RecipeID = 1;
COMMIT;
SELECT * FROM Recipes;

-- 5.3.2 --
START TRANSACTION;
INSERT INTO Recipes(RecipeName, Category, PrepTime, Instructions, UserID)
VALUES ('Burger','FastFood',15,'Cook burger',1);
SAVEPOINT sp2;
INSERT INTO Recipes(RecipeName, Category, PrepTime, Instructions, UserID)
VALUES ('Pizza','Italian',20,'Bake pizza',1);
ROLLBACK TO sp2;
COMMIT;
SELECT * FROM Recipes;

-- 5.3.3 --
START TRANSACTION;
DELETE FROM Recipes
WHERE RecipeID = 3;
SAVEPOINT sp3;
DELETE FROM Recipes
WHERE RecipeID = 1;
ROLLBACK TO sp3;
COMMIT;
SELECT * FROM Recipes;

-- 5.3.4 --
START TRANSACTION;
INSERT INTO Review (Review_text, Rating, Review_date, User_id, Recipe_id)
VALUES ('Amazing recipe', 5, '2026-04-10', 1, 1);
SAVEPOINT sp4;
UPDATE Review
SET Rating = 3
WHERE Review_id = 1;
ROLLBACK TO sp4;
COMMIT;
SELECT * FROM Review;

-- 5.3.5 --
START TRANSACTION;
INSERT INTO Ingredients(IngredientName)
VALUES ('Cheese');
SAVEPOINT sp5;
INSERT INTO Ingredients(IngredientName)
VALUES ('Butter');
ROLLBACK TO sp5;
COMMIT;
SELECT * FROM Ingredients;

-- 5.4.1 --
START TRANSACTION;
SELECT * FROM Recipes
WHERE RecipeID = 1
FOR UPDATE;
UPDATE Recipes
SET PrepTime = PrepTime + 1
WHERE RecipeID = 1;
COMMIT;

-- 5.4.2 --
LOCK TABLES Recipes WRITE;
UPDATE Recipes
SET PrepTime = PrepTime + 2
WHERE RecipeID = 1;
UNLOCK TABLES;

-- example --
-- Transaction 1
START TRANSACTION;
SELECT * FROM recipes WHERE RecipeID = 101 FOR UPDATE;
-- Transaction 2 (runs at same time)
START TRANSACTION;
UPDATE recipes SET PrepTime = 30 WHERE RecipeID = 101;
-- Transaction 1 finishes
COMMIT;
-- Transaction 2 continues
COMMIT;
