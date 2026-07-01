```sql
-- Create Database
CREATE DATABASE notes_app;

-- Connect to the database
-- \c notes_app

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes Table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(255) NOT NULL,

    body TEXT NOT NULL,

    category VARCHAR(100),

    pinned BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

```
