# Product Management API

A RESTful API for managing a product catalog, built with Node.js, Express, and TypeScript.

## Features

*   **CRUD Operations**: Full support for Creating, Reading, Updating, and Deleting products.
*   **TypeScript**: Type-safe code for better maintainability and fewer runtime errors.
*   **Validation**: Relies on Mongoose schemas for robust server-side data validation.
*   **Testing**: Comes with a full integration test suite using Jest and Supertest.
*   **Database Seeding**: A script to populate the database with fake data for testing purposes.

## Tech Stack

*   **Backend**: Node.js, Express.js
*   **Language**: TypeScript
*   **Database**: MongoDB with Mongoose ODM
*   **Testing**: Jest, Supertest, `mongodb-memory-server`

---

## Prerequisites

Make sure you have the following installed on your machine:
*   Node.js (v18.x or later)
*   npm (v8.x or later)
*   MongoDB (v5.x or later)

---

## Installation and Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up the Database:**
    This project requires a running MongoDB instance. You can install MongoDB locally on your machine.

4.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project. This file will store your database connection string and the port for the server.

    ```env
    # .env
    # Replace with your MongoDB connection string if it's different
    MONGO_URI=mongodb://localhost:27017/product-api
    PORT=3000
    ```

---

## Running the Application

You can run the application in two modes:

### Development Mode (Recommended for developing)

This mode uses `nodemon` to automatically restart the server on file changes.

```sh
npm run dev
```
The API will be available at `http://localhost:3000`.

### 2. Production Mode

This compiles the TypeScript code to JavaScript and runs the optimized version.

```sh
# First, build the TypeScript code
npm run build

# Then, start the server
npm start
```

## Seeding the Database

To populate the database with initial fake data for testing, you can run the seed script. This script will clear the existing products and insert 20 new ones.

**Important**: Make sure your database is running (either locally or via Docker) before seeding.

```sh
npm run seed
```

---

## Running Tests

The project uses Jest and Supertest for integration testing. The tests run against an in-memory MongoDB server, so they don't affect your development database.

```sh
npm test
```

---

## API Endpoints

Here is a detailed list of the available API endpoints.

### 1. Create a Product

*   **Endpoint**: `POST /api/products`
*   **Description**: Adds a new product to the database.
*   **Request Body**:
    ```json
    {
      "name": "Wireless Keyboard",
      "price": 79.99,
      "category": "Electronics"
    }
    ```
*   **Success Response** (`201 Created`):
    ```json
    {
      "_id": "60d5f2f5c7b3b3b3b3b3b3b3",
      "name": "Wireless Keyboard",
      "price": 79.99,
      "category": "Electronics",
      "__v": 0
    }
    ```
*   **Example with `curl`**:
    ```sh
    curl -X POST http://localhost:3000/api/products \
    -H "Content-Type: application/json" \
    -d '{"name": "Wireless Keyboard", "price": 79.99, "category": "Electronics"}'
    ```

### 2. Get All Products

*   **Endpoint**: `GET /api/products`
*   **Description**: Retrieves a list of all products.
*   **Success Response** (`200 OK`):
    ```json
    [
      {
        "_id": "60d5f2f5c7b3b3b3b3b3b3b3",
        "name": "Wireless Keyboard",
        "price": 79.99,
        "category": "Electronics",
        "__v": 0
      }
    ]
    ```
*   **Example with `curl`**:
    ```sh
    curl http://localhost:3000/api/products
    ```

### 3. Get a Single Product

*   **Endpoint**: `GET /api/products/:id`
*   **Description**: Retrieves a single product by its unique ID.
*   **Success Response** (`200 OK`):
    ```json
    {
      "_id": "60d5f2f5c7b3b3b3b3b3b3b3",
      "name": "Wireless Keyboard",
      "price": 79.99,
      "category": "Electronics",
      "__v": 0
    }
    ```
*   **Example with `curl`**:
    ```sh
    curl http://localhost:3000/api/products/60d5f2f5c7b3b3b3b3b3b3b3
    ```

### 4. Update a Product

*   **Endpoint**: `PATCH /api/products/:id`
*   **Description**: Updates an existing product's information.
*   **Request Body**:
    ```json
    {
      "price": 75.50
    }
    ```
*   **Success Response** (`200 OK`):
    ```json
    {
      "_id": "60d5f2f5c7b3b3b3b3b3b3b3",
      "name": "Wireless Keyboard",
      "price": 75.50,
      "category": "Electronics",
      "__v": 0
    }
    ```
*   **Example with `curl`**:
    ```sh
    curl -X PUT http://localhost:3000/api/products/60d5f2f5c7b3b3b3b3b3b3b3 \
    -H "Content-Type: application/json" \
    -d '{"price": 75.50}'
    ```

### 5. Delete a Product

*   **Endpoint**: `DELETE /api/products/:id`
*   **Description**: Deletes a product from the database.
*   **Success Response**: `204 No Content` with an empty body.
*   **Example with `curl`**:
    ```sh
    curl -X DELETE http://localhost:3000/api/products/60d5f2f5c7b3b3b3b3b3b3b3
    ```
