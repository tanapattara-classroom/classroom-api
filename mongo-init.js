// MongoDB initialization script
db = db.getSiblingDB("classroom-api");

// Create admin user for the classroom-api database
db.createUser({
  user: "admin",
  pwd: "password123",
  roles: [
    {
      role: "readWrite",
      db: "classroom-api",
    },
  ],
});

// Create collections
db.createCollection("users");
db.createCollection("books");

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.books.createIndex({ title: "text", author: "text", description: "text" });
db.books.createIndex({ addedBy: 1 });
db.books.createIndex({ genre: 1 });
db.books.createIndex({ available: 1 });

print("MongoDB initialization completed successfully!");
