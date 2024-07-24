# Authentication System

## Overview

This project is a simple authentication system built with Node.js and Express. It includes endpoints for user registration, login, and profile retrieval, utilizing bcrypt for password hashing and JWT for authentication.

## Features

- **User Registration**: Hashes passwords and stores user information.
- **User Login**: Authenticates users and generates JWT tokens.
- **Get Profile**: Retrieves user profile information when authenticated.

## Technologies

- Node.js
- Express
- Sequelize (for ORM)
- bcryptjs (for password hashing)
- jsonwebtoken (for JWT)
- Jest (for testing)
- Supertest (for integration testing)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/AnirudhKaranth/authentication_system.git
    ```

2. **Navigate into the project directory:**

    ```bash
    cd yourrepository
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Create a `.env` file in the root directory and add the following environment variables:**

    ```
    dbname="database name"
    dbuser="db username"
    dbpassword="db password"
    JWT_SECRET="any secret"
    ```

## Running the Application

1. **Start the server:**

    ```bash
    node index.js
    ```

   The server will start on `http://localhost:8000` by default. You can change the port by modifying the `index.js` file.

## API Endpoints

### Register

- **URL:** `/register`
- **Method:** `POST`
- **Request Body:**

    ```json
    {
      "username": "testuser",
      "email": "testuser@example.com",
      "password": "password123"
    }
    ```

- **Response:**

    ```json
    {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com",
      "msg": "registered successfully"
    }
    ```

### Login

- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**

    ```json
    {
      "email": "testuser@example.com",
      "password": "password123"
    }
    ```

- **Response:**

    ```json
    {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com",
      "token": "jwtToken",
      "msg": "logged in successfully"
    }
    ```

### Get Profile

- **URL:** `/profile`
- **Method:** `GET`
- **Headers:**

    ```
    Authorization: Bearer <jwtToken>
    ```

- **Response:**

    ```json
    {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com",
      "msg": "profile fetched successfully"
    }
    ```

## Testing

To run tests, execute:

```bash
npm test
