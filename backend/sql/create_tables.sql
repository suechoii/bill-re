CREATE TABLE verify
(
    email VARCHAR(100) UNIQUE NOT NULL, 
    username VARCHAR(20) UNIQUE NOT NULL, 
    verification_code VARCHAR(6) NOT NULL, 
    password VARCHAR(100) NOT NULL,
    payme_link VARCHAR(100) NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE user
(
    user_id  INT NOT NULL AUTO_INCREMENT, 
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(20) UNIQUE NOT NULL, 
    password VARCHAR(100) NOT NULL, 
     payme_link VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp ON UPDATE current_timestamp NOT NULL, 
    PRIMARY KEY(user_id)
);

CREATE TABLE friendship
(
    friendship_id INT NOT NULL AUTO_INCREMENT, 
    user_id INT NOT NULL, 
    friend_id INT NOT NULL, 
    friend_username varchar(20) NOT NULL, 
    PRIMARY KEY(friendship_id), 
    FOREIGN KEY (user_id) REFERENCES user (user_id)
    -- FOREIGN KEY (friend_id) REFERENCES user (user_id)
);

CREATE TABLE borrow 
(
    borrow_id INT AUTO_INCREMENT PRIMARY KEY,
    total_amount FLOAT NOT NULL,
    description VARCHAR(2000) NOT NULL
);

CREATE TABLE record (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    borrow_id INT,
    user_id INT NOT NULL,
    user_username VARCHAR(20) NOT NULL,
    friend_id INT NOT NULL,
    friend_username VARCHAR(20) NOT NULL,
    amount FLOAT NOT NULL,
    status BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (borrow_id) REFERENCES borrow(borrow_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);
