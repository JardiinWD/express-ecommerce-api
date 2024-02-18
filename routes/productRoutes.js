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
    uploadImage
} = require('./../controllers/productController')
// Importing the Authenticazion Middleware for protecting Login
const { authenticationMiddleware, authorizePermissions } = require('./../middleware/authentication')

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

// Upload Image route
router
    .route('/uploadImage')
    .post([authenticationMiddleware, authorizePermissions('admin')], uploadImage)



// Export router
module.exports = router