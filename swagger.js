const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Classroom API",
      version: "1.0.0",
      description:
        "A simple Node.js API with user authentication and book management",
      contact: {
        name: "API Support",
        email: "support@classroom-api.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.classroom-api.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            username: {
              type: "string",
              description: "Username (3-30 characters)",
              minLength: 3,
              maxLength: 30,
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user",
              description: "User role",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "User last update timestamp",
            },
          },
          required: ["username", "email"],
        },
        Book: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Book ID",
            },
            title: {
              type: "string",
              description: "Book title",
              maxLength: 200,
            },
            author: {
              type: "string",
              description: "Book author",
              maxLength: 100,
            },
            description: {
              type: "string",
              description: "Book description",
              maxLength: 1000,
            },
            genre: {
              type: "string",
              description: "Book genre",
              maxLength: 50,
            },
            year: {
              type: "integer",
              description: "Publication year",
              minimum: 1000,
              maximum: 2024,
            },
            price: {
              type: "number",
              description: "Book price",
              minimum: 0,
            },
            available: {
              type: "boolean",
              description: "Book availability",
              default: true,
            },
            addedBy: {
              type: "object",
              description: "User who added the book",
              properties: {
                _id: { type: "string" },
                username: { type: "string" },
                email: { type: "string" },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Book creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Book last update timestamp",
            },
          },
          required: ["title", "author"],
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
            message: {
              type: "string",
              description: "Detailed error message",
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  value: { type: "string" },
                  msg: { type: "string" },
                  param: { type: "string" },
                  location: { type: "string" },
                },
              },
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              description: "Current page number",
            },
            limit: {
              type: "integer",
              description: "Number of items per page",
            },
            total: {
              type: "integer",
              description: "Total number of items",
            },
            pages: {
              type: "integer",
              description: "Total number of pages",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints",
      },
      {
        name: "Books",
        description: "Book management endpoints",
      },
      {
        name: "Health",
        description: "System health check",
      },
    ],
  },
  apis: ["./routes/*.js", "./server.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
