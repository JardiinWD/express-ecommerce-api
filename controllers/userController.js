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
// Importing the createJWT function created on utilities folder
const { createTokenUser, attachCookiesToResponse, checkPermission } = require('../utilities/index')

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

    // Check if the user has the permission for performing operation
    checkPermission(req.user, user._id)

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
    // Return the current user information stored in the request object
    res.status(StatusCodes.OK).json({
        status: 'success',
        user: req.user
    })
})


/** Controller function for updating a user (with user.save)
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const updateUser = catchAsync(async (req, res) => {
    // Extract email and name from request body
    const { email, name } = req.body

    // Check if email or name is missing
    if (!email || !name)
        throw new BadRequestError('Please provide both email and name')

    // Find the user by ID
    const user = await User.findOne({
        _id: req.user.userId
    })

    // Update user's email and name
    user.email = email
    user.name = name

    // Save the updated user
    await user.save()

    // Create token user for JWT
    const tokenUser = createTokenUser(user)

    // Attach JWT token as cookie to response
    attachCookiesToResponse({
        res, // Express response object
        user: tokenUser // User object for the token
    })

    // Send response with updated user information
    res.status(StatusCodes.OK).json({
        status: 'success',
        user: tokenUser
    })
})


/** Controller function for updating a user's password
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const updateUserPassword = catchAsync(async (req, res) => {
    // Extract oldPassword and newPassword from request body
    const { oldPassword, newPassword } = req.body

    // Check if oldPassword or newPassword is missing
    if (!oldPassword || !newPassword)
        throw new BadRequestError('Please provide both old and new passwords')

    // Find the user by ID
    const user = await User.findOne({
        _id: req.user.userId
    })

    // Check if the provided old password matches the user's current password
    const isPasswordCorrect = await user.comparePassword(oldPassword)

    // If old password is incorrect, throw an error
    if (!isPasswordCorrect)
        throw new UnauthenticatedError('Invalid Credentials')

    // Update the user's password
    user.password = newPassword

    // Save the updated user
    await user.save()

    // Send response indicating successful password update
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


// ====== OBSOLETE ====== //

/** Controller function for updating a user (with findOneAndUpdate)
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
/* const updateUser = catchAsync(async (req, res) => {
    // Extract email and name from request body
    const { email, name } = req.body

    // Check if email or name is missing
    if (!email || !name)
        throw new BadRequestError('Please provide both email and name')

    // Find the user by ID and update their email and name
    const user = await User.findOneAndUpdate({
        _id: req.user.userId // User ID to identify the user
    }, {
        email, // New email value
        name // New name value
    }, {
        new: true, // Return the updated user document
        runValidators: true // Run validators for the updated fields
    })

    // Create token user object for attaching cookies
    const tokenUser = createTokenUser(user)

    // Attach cookies to the response
    attachCookiesToResponse({
        res, // Express response object
        user: tokenUser // User object for the token
    })

    // Send response indicating successful user update
    res.status(StatusCodes.OK).json({
        status: 'success',
        user: tokenUser // Updated user object
    })
})   */