const express = require("express");
const router = express.Router();
const { userCreate, userLogin } = require("../controllers/userController")
const { createBook, getBookByQueryParams, getBookById, updateBookById, deleteById } = require("../controllers/bookController")
const { createReview, updateReview, deleteReview } = require("../controllers/reviewController")
const { authentication ,authorization } = require("../middlewares/auth")

//----------User's Api-------------------//
router.post("/register", userCreate)
router.post("/login", userLogin)

//----------Book's Api-------------------//
router.post("/books", authentication,authorization, createBook)
router.get("/books", authentication, getBookByQueryParams)
router.get("/books/:bookId", authentication, getBookById)
router.put("/books/:bookId", authentication,authorization, updateBookById)
router.delete("/books/:bookId", authentication,authorization, deleteById)

//----------Review's Api-------------------//
router.post("/books/:bookId/review", createReview)
router.put("/books/:bookId/review/:reviewId", updateReview)
router.delete("/books/:bookId/review/:reviewId", deleteReview)

module.exports = router