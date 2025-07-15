# Classroom API

A simple Node.js API with user authentication and book management, built with Express.js, MongoDB, and Docker.

**Author:** Tanapattara Wongkhamchan  
**Class:** Computer and Information Science Program, Khon Kaen University

## Features

- **User Authentication**: Register, login, and profile management with JWT tokens
- **Book Management**: CRUD operations for books with search and filtering
- **Role-based Access**: User and admin roles with appropriate permissions
- **Docker Support**: Complete containerization with MongoDB
- **RESTful API**: Clean and well-documented endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **API Documentation**: Swagger/OpenAPI 3.0
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd classroom-api
   ```

2. **Start the services**

   ```bash
   docker-compose up -d
   ```

3. **Access the API**
   - API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs
   - MongoDB Express (Admin): http://localhost:8081
   - Health Check: http://localhost:3000/health

### Local Development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (using Docker)

   ```bash
   docker run -d --name mongodb -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=password123 \
     mongo:6.0
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint             | Description         | Auth Required |
| ------ | -------------------- | ------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user | No            |
| POST   | `/api/auth/login`    | Login user          | No            |
| GET    | `/api/auth/profile`  | Get user profile    | Yes           |
| PUT    | `/api/auth/profile`  | Update user profile | Yes           |

### Books

| Method | Endpoint                   | Description                              | Auth Required     |
| ------ | -------------------------- | ---------------------------------------- | ----------------- |
| GET    | `/api/books`               | Get all books (with pagination & search) | No                |
| GET    | `/api/books/:id`           | Get book by ID                           | No                |
| POST   | `/api/books`               | Create new book                          | Yes               |
| PUT    | `/api/books/:id`           | Update book                              | Yes (Owner/Admin) |
| DELETE | `/api/books/:id`           | Delete book                              | Yes (Owner/Admin) |
| GET    | `/api/books/user/my-books` | Get user's books                         | Yes               |
| GET    | `/api/books/genres/list`   | Get available genres                     | No                |

### Health Check

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | API health status |

### API Documentation

| Method | Endpoint    | Description                                |
| ------ | ----------- | ------------------------------------------ |
| GET    | `/api-docs` | Interactive API documentation (Swagger UI) |

## Request Examples

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Book (with authentication)

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A story of the fabulously wealthy Jay Gatsby",
    "genre": "Fiction",
    "publishedYear": 1925,
    "pages": 180,
    "price": 9.99
  }'
```

### Get Books with Search

```bash
curl "http://localhost:3000/api/books?search=gatsby&page=1&limit=10"
```

## Environment Variables

| Variable      | Description               | Default                                   |
| ------------- | ------------------------- | ----------------------------------------- |
| `NODE_ENV`    | Environment mode          | `development`                             |
| `PORT`        | Server port               | `3000`                                    |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/classroom-api` |
| `JWT_SECRET`  | JWT secret key            | `your-secret-key`                         |

## Docker Commands

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove volumes (will delete database data)
docker-compose down -v
```

## Database Schema

### User Model

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model

```javascript
{
  title: String (required),
  author: String (required),
  description: String,
  genre: String,
  year: Number,
  price: Number,
  available: Boolean (default: true),
  addedBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- Role-based access control
- CORS protection
- Non-root Docker user

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
