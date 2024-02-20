// Requiring the 'express' module
const express = require('express');
// Creating an instance of an Express Router
const router = express.Router();
// Importing the productController controllers
const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
} = require('./../controllers/reviewController')

// Importing the Authenticazion Middleware for protecting Login
const { authenticationMiddleware, authorizePermissions } = require('./../middleware/authentication')

// Route for GET all products
router
    .route('/')
    .post(authenticationMiddleware, createReview)
    .get(getAllReviews)

// CRUD operations for single product    
router
    .route('/:id')
    .get(getSingleReview)
    .patch(authenticationMiddleware, updateReview)
    .delete(authenticationMiddleware, deleteReview)


// Export router
module.exports = router