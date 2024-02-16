// Requiring the 'express' module
const express = require('express');
// Creating an instance of an Express Router
const router = express.Router();
// Importing the login and register controllers
const {
    getAllUsers, getSingleUser,
    showCurrentUser,
    updateUserPassword,
    updateUser
} = require('./../controllers/userController')
// Importing the Authenticazion Middleware for protecting Login
const authenticationMiddleware = require('./../middleware/authentication')

// Route for GET all users
router.route('/').get(getAllUsers);
// Route to show current user
router.route('/showMe').get(showCurrentUser)
// Route to update user
router.route('/updateUser').post(updateUser)
// Route to update user password
router.route('/updateUserPassword').post(updateUserPassword)
// Route to get a single user by ID
router.route('/:id').get(getSingleUser)



// Export router
module.exports = router