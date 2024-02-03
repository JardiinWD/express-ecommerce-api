// Requiring the 'express' module
const express = require('express');
// Creating an instance of an Express Router
const router = express.Router();
// Importing the login and register controllers
const { login, logout, register } = require('./../controllers/authController')
// Importing the Authenticazion Middleware for protecting Login
const authenticationMiddleware = require('./../middleware/authentication')

// Route for user registration
router.post('/register', register);
// Route for user login
router.post('/login', login);
// Route for user logout
router.get('/logout', logout);


// Export router
module.exports = router