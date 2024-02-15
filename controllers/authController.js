// Importing the catchAsync function
const catchAsync = require('./../utilities/catchAsync');
// Importing User Model
const User = require('./../models/User');
// Importing the Status Code Package
const { StatusCodes } = require('http-status-codes');
// Importing the BadRequest error handler
const { BadRequestError, UnauthenticatedError } = require('./../errors/index');
// Importing the jwtoken for generating a unique token
const JWToken = require('jsonwebtoken');
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: '../config.env' })
// Importing the createJWT function created on utilities folder
const { attachCookiesToResponse } = require('../utilities/index')


/** Controller function for user login
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const login = catchAsync(async (req, res) => {
    res.send('Login Controller')
});



/** Controller function for user logout
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const logout = catchAsync(async (req, res) => {
    res.send('Logout Controller')
});



/** Controller function for user registration
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const register = catchAsync(async (req, res) => {
    // Get email from Req.body
    const { email, name, password } = req.body
    // Check if the email already exists
    const emailAlreadyExists = await User.findOne({ email })
    if (emailAlreadyExists) throw new BadRequestError('Email already exists')

    // First registered user is an admin
    const isFirstAccount = await User.countDocuments({}) === 0;
    // Check the firstAccount
    const role = isFirstAccount ? 'admin' : 'user'

    // If the previous condition was false then create the user
    const user = await User.create(req.body)

    // Creating the user object for the token with necessary information
    const tokenUser = {
        name: user.name, // User's name
        userId: user._id, // User's ID
        role: user.role // User's role
    }

    // Adding cookies to the response containing the JWT token
    attachCookiesToResponse({ // Function to add cookies to the response
        res, // Express response object
        user: tokenUser // User object for the token
    })

    // Sending the response with "created" status and user data for the token
    res.status(StatusCodes.CREATED).json({
        status: "success", // Request status
        data: tokenUser // User data for the token
    })


});

// Exporting the Register and Login controller
module.exports = {
    register,
    login,
    logout
};
