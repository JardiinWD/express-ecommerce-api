// Requiring the 'express' module
const express = require('express');
// Creating an instance of an Express Router
const router = express.Router();
// Importing the orderController controllers
const {
    updateOrder,
    createOrder,
    getCurrentUserOrder,
    getSingleOrder,
    getAllOrders
} = require('./../controllers/orderController')
// Importing the Authenticazion Middleware for protecting Login
const { authenticationMiddleware, authorizePermissions } = require('./../middleware/authentication');


// Route for GET all orders
router
    .route('/')
    .get([authenticationMiddleware, authorizePermissions('admin')], getAllOrders)
    .post(authenticationMiddleware, createOrder)

// Route for showAllMyOrders    
router
    .route('/showAllMyOrders')
    .get(authenticationMiddleware, getCurrentUserOrder)

// CRUD operations for single order    
router
    .route('/:id')
    .get(authenticationMiddleware, getSingleOrder)
    .patch(authenticationMiddleware, updateOrder)


// Export router
module.exports = router