// Importing the Status Codes package for HTTP status code constants
const { StatusCodes } = require('http-status-codes');
// Importing the User model for interacting with user data
const User = require('../models/User');
// Importing the functions on error handler
const {
    BadRequestError,
    UnauthenticatedError,
    CustomAPIError,
    NotFoundError
} = require('./../errors/index');
// Importing catchAsync utilities
const catchAsync = require("../utilities/catchAsync");


/** Controller function for getting all users
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getAllUsers = catchAsync(async (req, res) => {
    // Query all users with role 'user' and exclude password field
    const users = await User.find({
        role: 'user' // Filter users by role
    }).select('-password -__v') // Exclude password field from the response

    // Respond with the list of users
    res.status(StatusCodes.OK).json({
        status: 'success', // Success status
        data: {
            users // User data
        }
    })
})


/** Controller function for getting a single user
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getSingleUser = catchAsync(async (req, res) => {
    // Find the user by ID and exclude password and version fields
    const user = await User.findOne({
        _id: req.params.id // Find user by ID
    }).select('-password -__v') // Exclude password and version fields

    // If user not found, throw a NotFoundError
    if (!user)
        throw new NotFoundError(`No user with id : ${req.params.id}`)

    // Respond with the found user
    res.status(StatusCodes.OK).json({
        status: 'success', // Success status
        user // User data
    })
})


/** Controller function for showing current user
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const showCurrentUser = catchAsync(async (req, res) => {
    // CONTROLLER TO SHOW CURRENT USER
})

/** Controller function for updating a user
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const updateUser = catchAsync(async (req, res) => {
    // CONTROLLER TO UPDATE A USER
})

/** Controller function for updating a user's password
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const updateUserPassword = catchAsync(async (req, res) => {
    // CONTROLLER TO UPDATE A USER'S PASSWORD
})

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}
