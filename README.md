# OrioNN QR Menu API Server

A robust REST API for managing QR menu systems with user authentication, category management, and product catalog functionality.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📁 **Category Management** - Full CRUD operations for menu categories
- 🍽️ **Product Management** - Complete product catalog with category relationships
- 🔍 **Advanced Filtering** - Search, pagination, and sorting capabilities
- ✅ **Input Validation** - Comprehensive request validation using express-validator
- 🛡️ **Security** - Password hashing, CORS, Helmet, and rate limiting
- 📊 **Database** - MySQL with Sequelize ORM
- 📝 **API Documentation** - Complete endpoint documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Logging**: Morgan, Winston

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=orionn_qrmenu
   DB_USER=your_username
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=1h

   # Optional: Email Configuration (for future features)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Database Setup**

   ```sql
   CREATE DATABASE orionn_qrmenu;
   ```

5. **Run the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Categories

- `POST /api/v1/categories` - Create category
- `GET /api/v1/categories` - Get all categories (with pagination)
- `GET /api/v1/categories/:id` - Get category by ID
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category
- `PATCH /api/v1/categories/:id/deactivate` - Deactivate category
- `PATCH /api/v1/categories/:id/activate` - Activate category

### Products

- `POST /api/v1/products` - Create product
- `GET /api/v1/products` - Get all products (with filtering & pagination)
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `PATCH /api/v1/products/:id/deactivate` - Deactivate product
- `PATCH /api/v1/products/:id/activate` - Activate product
- `GET /api/v1/products/category/:categoryId` - Get products by category

### Health Check

- `GET /health` - API health status

## Database Schema

### Users Table

```sql
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Categories Table

```sql
CREATE TABLE Categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table

```sql
CREATE TABLE Products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  categoryId INT,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES Categories(id)
);
```

## Usage Examples

### 1. Register a User

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

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a Category

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Main Dishes",
    "description": "Delicious main course options"
  }'
```

### 4. Create a Product

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

## Query Parameters

### Pagination

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Filtering

- `isActive` - Filter by active status ("true" or "false")
- `categoryId` - Filter products by category
- `search` - Search in title and description (products only)

### Sorting (Products only)

- `sortBy` - Sort field ("title", "createdAt", "updatedAt")
- `sortOrder` - Sort order ("ASC" or "DESC")

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable CORS settings
- **Helmet**: Security headers
- **Rate Limiting**: Built-in rate limiting protection

## Development

### Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── package.json
├── README.md
└── API_DOCUMENTATION.md
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
