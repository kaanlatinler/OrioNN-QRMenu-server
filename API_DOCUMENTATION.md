# OrioNN QR Menu API Documentation

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... },
  "errors": [ ... ] // Only present on validation errors
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Category Endpoints

### Create Category

**POST** `/categories`

**Request Body:**

```json
{
  "title": "Main Dishes",
  "description": "Delicious main course options",
  "image": "https://example.com/main-dishes.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 1,
    "title": "Main Dishes",
    "description": "Delicious main course options",
    "image": "https://example.com/main-dishes.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Categories

**GET** `/categories`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `isActive` (optional): Filter by active status ("true" or "false")

**Example:** `GET /categories?page=1&limit=5&isActive=true`

**Response:**

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": 1,
        "title": "Main Dishes",
        "description": "Delicious main course options",
        "image": "https://example.com/main-dishes.jpg",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "Products": [
          {
            "id": 1,
            "title": "Grilled Chicken",
            "isActive": true
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15,
      "itemsPerPage": 10
    }
  }
}
```

### Get Category by ID

**GET** `/categories/:id`

**Response:**

```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": 1,
    "title": "Main Dishes",
    "description": "Delicious main course options",
    "image": "https://example.com/main-dishes.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "Products": [
      {
        "id": 1,
        "title": "Grilled Chicken",
        "description": "Juicy grilled chicken breast",
        "image": "https://example.com/chicken.jpg",
        "isActive": true
      }
    ]
  }
}
```

### Update Category

**PUT** `/categories/:id`

**Request Body:**

```json
{
  "title": "Updated Main Dishes",
  "description": "Updated description",
  "image": "https://example.com/updated-image.jpg",
  "isActive": true
}
```

### Delete Category

**DELETE** `/categories/:id`

**Note:** Cannot delete categories that have associated products.

### Deactivate Category

**PATCH** `/categories/:id/deactivate`

### Activate Category

**PATCH** `/categories/:id/activate`

---

## Product Endpoints

### Create Product

**POST** `/products`

**Request Body:**

```json
{
  "title": "Grilled Chicken",
  "description": "Juicy grilled chicken breast with herbs",
  "image": "https://example.com/chicken.jpg",
  "categoryId": 1
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "title": "Grilled Chicken",
    "description": "Juicy grilled chicken breast with herbs",
    "image": "https://example.com/chicken.jpg",
    "categoryId": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "Category": {
      "id": 1,
      "title": "Main Dishes",
      "isActive": true
    }
  }
}
```

### Get All Products

**GET** `/products`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `isActive` (optional): Filter by active status ("true" or "false")
- `categoryId` (optional): Filter by category ID
- `search` (optional): Search in title and description
- `sortBy` (optional): Sort field ("title", "createdAt", "updatedAt")
- `sortOrder` (optional): Sort order ("ASC" or "DESC")

**Example:** `GET /products?page=1&limit=5&categoryId=1&search=chicken&sortBy=title&sortOrder=ASC`

**Response:**

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": 1,
        "title": "Grilled Chicken",
        "description": "Juicy grilled chicken breast with herbs",
        "image": "https://example.com/chicken.jpg",
        "categoryId": 1,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "Category": {
          "id": 1,
          "title": "Main Dishes",
          "isActive": true
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15,
      "itemsPerPage": 10
    }
  }
}
```

### Get Product by ID

**GET** `/products/:id`

**Response:**

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "title": "Grilled Chicken",
    "description": "Juicy grilled chicken breast with herbs",
    "image": "https://example.com/chicken.jpg",
    "categoryId": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "Category": {
      "id": 1,
      "title": "Main Dishes",
      "description": "Delicious main course options",
      "image": "https://example.com/main-dishes.jpg",
      "isActive": true
    }
  }
}
```

### Update Product

**PUT** `/products/:id`

**Request Body:**

```json
{
  "title": "Updated Grilled Chicken",
  "description": "Updated description",
  "image": "https://example.com/updated-chicken.jpg",
  "categoryId": 2,
  "isActive": true
}
```

### Delete Product

**DELETE** `/products/:id`

### Deactivate Product

**PATCH** `/products/:id/deactivate`

### Activate Product

**PATCH** `/products/:id/activate`

### Get Products by Category

**GET** `/products/category/:categoryId`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `isActive` (optional): Filter by active status ("true" or "false")

**Response:**

```json
{
  "success": true,
  "message": "Products by category retrieved successfully",
  "data": {
    "category": {
      "id": 1,
      "title": "Main Dishes",
      "description": "Delicious main course options",
      "image": "https://example.com/main-dishes.jpg"
    },
    "products": [
      {
        "id": 1,
        "title": "Grilled Chicken",
        "description": "Juicy grilled chicken breast with herbs",
        "image": "https://example.com/chicken.jpg",
        "categoryId": 1,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "Category": {
          "id": 1,
          "title": "Main Dishes",
          "isActive": true
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 5,
      "itemsPerPage": 10
    }
  }
}
```

---

## Health Check

### API Health

**GET** `/health`

**Response:**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## Error Responses

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "Access token is required"
}
```

### Not Found Error

```json
{
  "success": false,
  "message": "Category not found"
}
```

### Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Usage Examples

### Complete Workflow

1. **Register a user:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

2. **Login to get token:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

3. **Create a category:**

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Main Dishes",
    "description": "Delicious main course options"
  }'
```

4. **Create a product:**

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Grilled Chicken",
    "description": "Juicy grilled chicken breast",
    "categoryId": 1
  }'
```

5. **Get all products:**

```bash
curl -X GET "http://localhost:3000/api/v1/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
