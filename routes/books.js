const express = require("express");
const { body, validationResult } = require("express-validator");
const Book = require("../models/Book");
const { auth, adminAuth } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     BookRequest:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *           description: Book title
 *         author:
 *           type: string
 *           maxLength: 100
 *           description: Book author
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Book description
 *         genre:
 *           type: string
 *           maxLength: 50
 *           description: Book genre
 *         year:
 *           type: integer
 *           minimum: 1000
 *           maximum: 2024
 *           description: Publication year
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Book price
 *         available:
 *           type: boolean
 *           default: true
 *           description: Book availability
 *     BookUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *         author:
 *           type: string
 *           maxLength: 100
 *         description:
 *           type: string
 *           maxLength: 1000
 *         genre:
 *           type: string
 *           maxLength: 50
 *         year:
 *           type: integer
 *           minimum: 1000
 *           maximum: 2024
 *         price:
 *           type: number
 *           minimum: 0
 *         available:
 *           type: boolean
 *     BooksResponse:
 *       type: object
 *       properties:
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *     BookResponse:
 *       type: object
 *       properties:
 *         book:
 *           $ref: '#/components/schemas/Book'
 *     GenresResponse:
 *       type: object
 *       properties:
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: List of available genres
 */

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books with pagination and search
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title, author, or description
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BooksResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get all books with pagination and search
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const genre = req.query.genre || "";
    const available = req.query.available;

    const query = {};

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by genre
    if (genre) {
      query.genre = genre;
    }

    // Filter by availability
    if (available !== undefined) {
      query.available = available === "true";
    }

    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .populate("addedBy", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(query);

    res.json({
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "addedBy",
      "username email"
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ book });
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookRequest'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Create new book (requires authentication)
router.post(
  "/",
  auth,
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 200 })
      .withMessage("Title must be less than 200 characters"),
    body("author")
      .notEmpty()
      .withMessage("Author is required")
      .isLength({ max: 100 })
      .withMessage("Author must be less than 100 characters"),
    body("description")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Description must be less than 1000 characters"),
    body("genre")
      .optional()
      .isLength({ max: 50 })
      .withMessage("Genre must be less than 50 characters"),
    body("year")
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage("Year must be a valid year"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a non-negative number"),
    body("available")
      .optional()
      .isBoolean()
      .withMessage("Available must be a boolean value"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bookData = {
        ...req.body,
        addedBy: req.user._id,
      };

      const book = new Book(bookData);
      await book.save();

      const populatedBook = await Book.findById(book._id).populate(
        "addedBy",
        "username email"
      );

      res.status(201).json({
        message: "Book created successfully",
        book: populatedBook,
      });
    } catch (error) {
      console.error("Create book error:", error);
      res.status(500).json({ error: "Failed to create book" });
    }
  }
);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdateRequest'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User can only update their own books
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update book (requires authentication and ownership or admin role)
router.put(
  "/:id",
  auth,
  [
    body("title")
      .optional()
      .isLength({ max: 200 })
      .withMessage("Title must be less than 200 characters"),
    body("author")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Author must be less than 100 characters"),
    body("description")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Description must be less than 1000 characters"),
    body("genre")
      .optional()
      .isLength({ max: 50 })
      .withMessage("Genre must be less than 50 characters"),
    body("year")
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage("Year must be a valid year"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a non-negative number"),
    body("available")
      .optional()
      .isBoolean()
      .withMessage("Available must be a boolean value"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      // Check if user can update the book (owner or admin)
      if (
        book.addedBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          error: "Access denied. You can only update your own books.",
        });
      }

      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate("addedBy", "username email");

      res.json({
        message: "Book updated successfully",
        book: updatedBook,
      });
    } catch (error) {
      console.error("Update book error:", error);
      res.status(500).json({ error: "Failed to update book" });
    }
  }
);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User can only delete their own books
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Delete book (requires authentication and ownership or admin role)
router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if user can delete the book (owner or admin)
    if (
      book.addedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Access denied. You can only delete your own books." });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

/**
 * @swagger
 * /api/books/user/my-books:
 *   get:
 *     summary: Get current user's books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User's books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BooksResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get books by user (requires authentication)
router.get("/user/my-books", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find({ addedBy: req.user._id })
      .populate("addedBy", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments({ addedBy: req.user._id });

    res.json({
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user books error:", error);
    res.status(500).json({ error: "Failed to fetch user books" });
  }
});

/**
 * @swagger
 * /api/books/genres/list:
 *   get:
 *     summary: Get available genres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Genres retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenresResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get available genres
router.get("/genres/list", async (req, res) => {
  try {
    const genres = await Book.distinct("genre");
    res.json({ genres: genres.filter((genre) => genre) });
  } catch (error) {
    console.error("Get genres error:", error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

module.exports = router;
