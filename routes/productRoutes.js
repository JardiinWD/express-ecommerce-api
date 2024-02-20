// Requiring the 'express' module
const express = require('express');
// Creating an instance of an Express Router
const router = express.Router();
// Importing the productController controllers
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} = require('./../controllers/productController')
// Importing the reviewController controllers
const {
    getSingleProductReviews
} = require('./../controllers/reviewController')


// Importing the Authenticazion Middleware for protecting Login
const { authenticationMiddleware, authorizePermissions } = require('./../middleware/authentication');

// Route for GET all products
router
    .route('/')
    .post([authenticationMiddleware, authorizePermissions('admin')], createProduct)
    .get(getAllProducts)

// CRUD operations for single product    
router
    .route('/:id')
    .get(getSingleProduct)
    .patch([authenticationMiddleware, authorizePermissions('admin')], updateProduct)
    .delete([authenticationMiddleware, authorizePermissions('admin')], deleteProduct)

// GET operation for single product reviews
router
    .route('/:id/reviews')
    .get(getSingleProductReviews)



// Export router
module.exports = router