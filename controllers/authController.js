// Importing the catchAsync function
const catchAsync = require('./../utilities/catchAsync');
// Importing User Model
const User = require('./../models/User');
// Importing the Status Code Package
const { StatusCodes } = require('http-status-codes');
// Importing the BadRequest error handler
const { BadRequestError, UnauthenticatedError, CustomAPIError } = require('./../errors/index');
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: '../config.env' })
// Importing the createJWT function created on utilities folder
const { attachCookiesToResponse, createTokenUser } = require('../utilities/index')


/** Controller function for user logout
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const logout = catchAsync(async (req, res) => {
    // Remove Cookie token
    res.cookie('token', 'logout', {
        httpOnly: true, // Make the cookie accessible only via HTTP(S)
        expires: new Date(Date.now()), // Token expires in 5s
    })

    // Sending the response with "logged Out" status and user data for the token
    res.status(StatusCodes.OK).json({
        status: "success", // Request status
        message: "Successfully logged out" // User data for the token
    })
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
    if (emailAlreadyExists)
        throw new BadRequestError('Email already exists')

    // First registered user is an admin
    const isFirstAccount = await User.countDocuments({}) === 0;
    // Check the firstAccount
    const role = isFirstAccount ? 'admin' : 'user'

    // If the previous condition was false then create the user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    // Creating the user object for the token with necessary information
    const tokenUser = createTokenUser(user)

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


/** Controller function for user login
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const login = catchAsync(async (req, res) => {
    // Get email and password from req.body
    const { email, password } = req.body

    // Check if email or password is missing
    if (!email || !password)
        throw new BadRequestError('Please provide an email and password')

    // Find user by email
    const candidateUser = await User.findOne({ email })

    // If user not found, throw an error
    if (!candidateUser)
        throw new UnauthenticatedError('Invalid Credentials')

    // Check if the provided password matches the stored password for the user
    const isPasswordCorrect = await candidateUser.comparePassword(password)

    // If the password is incorrect, throw an error
    if (!isPasswordCorrect)
        throw new UnauthenticatedError('Invalid Credentials')

    // Creating the user object for the token with necessary information
    const tokenUser = {
        name: candidateUser.name, // User's name
        userId: candidateUser._id, // User's ID
        role: candidateUser.role // User's role
    }

    console.log("tokenUser login AuthController", tokenUser);

    // Adding cookies to the response containing the JWT token
    attachCookiesToResponse({ // Function to add cookies to the response
        res, // Express response object
        user: tokenUser // User object for the token (user MUST be "user")
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

