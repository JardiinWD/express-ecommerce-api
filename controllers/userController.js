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
    // INSERT COMMENT HERE
    res.status(StatusCodes.OK).json({
        status: 'success',
        user: req.user
    })
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
    // INSERT COMMENT HERE
    const { oldPassword, newPassword } = req.body
    // Check if oldPassword or newPassword is missing
    if (!oldPassword || !newPassword)
        throw new BadRequestError('Please provide both values')

    // Find the user by ID
    const user = await User.findOne({
        _id: req.user.userId
    })


    // INSERT COMMENT HERE
    const isPasswordCorrect = await user.comparePassword(oldPassword)

    // INSERT COMMENT HERE
    if (!isPasswordCorrect)
        throw new UnauthenticatedError('Invalid Credentials')

    // So if everything is fine then user can update his/her password
    user.password = newPassword
    // Then we can perform a save action on user
    await user.save()

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: "Success! Password updated"
    })

})





module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}
