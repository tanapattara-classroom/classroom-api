// mongo-sample-book.js
// This script inserts a sample user and sample books into the classroom-api database.
db = db.getSiblingDB("classroom-api");

// Insert a sample user if not exists (needed for addedBy reference)
const userId = ObjectId();
if (db.users.countDocuments({ email: "admin@cis.kku.ac.th" }) === 0) {
  db.users.insertOne({
    _id: userId,
    username: "admin",
    email: "admin@cis.kku.ac.th",
    password: "$2a$10$7QJ6QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw", // bcrypt hash for 'password123'
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// Sample books data
const sampleBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A novel about the serious issues of rape and racial inequality, told through the eyes of young Scout Finch in the Deep South.",
    genre: "Classic",
    year: 1960,
    price: 12.99,
    available: true,
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      "A dystopian novel about totalitarianism, surveillance, and the manipulation of truth in a futuristic society.",
    genre: "Dystopian",
    year: 1949,
    price: 11.99,
    available: true,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    genre: "Classic",
    year: 1925,
    price: 10.99,
    available: true,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      "A romantic novel of manners that follows the emotional development of Elizabeth Bennet.",
    genre: "Romance",
    year: 1813,
    price: 9.99,
    available: true,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description:
      "A fantasy novel about Bilbo Baggins, a hobbit who embarks on a quest to reclaim the Lonely Mountain.",
    genre: "Fantasy",
    year: 1937,
    price: 14.99,
    available: true,
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description:
      "A novel about teenage alienation and loss of innocence in post-World War II America.",
    genre: "Coming-of-age",
    year: 1951,
    price: 11.99,
    available: true,
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    description:
      "A novel about a group of British boys stranded on an uninhabited island and their disastrous attempt to govern themselves.",
    genre: "Allegory",
    year: 1954,
    price: 10.99,
    available: true,
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    description:
      "An allegorical novella about a group of farm animals who rebel against their human farmer.",
    genre: "Allegory",
    year: 1945,
    price: 8.99,
    available: true,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description:
      "A novel about a young Andalusian shepherd who dreams of finding a worldly treasure.",
    genre: "Adventure",
    year: 1988,
    price: 13.99,
    available: true,
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    description:
      "A dystopian novel about a futuristic society where people are genetically bred and pharmaceutically anesthetized.",
    genre: "Dystopian",
    year: 1932,
    price: 12.99,
    available: true,
  },
];

// Insert sample books if they don't exist
sampleBooks.forEach((book) => {
  if (db.books.countDocuments({ title: book.title }) === 0) {
    db.books.insertOne({
      ...book,
      addedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
});

print("Sample books and user inserted!");
