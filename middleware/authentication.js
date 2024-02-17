// Importing the catchAsync function
const catchAsync = require('./../utilities/catchAsync');
// Importing User Model
const User = require('./../models/User');
// Importing the Status Code Package
const { StatusCodes } = require('http-status-codes');
// Importing the BadRequest error handler
const { UnauthenticatedError, UnauthorizedError } = require('./../errors/index');
// Importing the jwtoken for generating a unique token
const JWToken = require('jsonwebtoken');
// Take the functionality from utilities
const { isTokenValid } = require('../utilities/index')


/** Middleware for user authentication
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 * @param {Function} next - Express next middleware function
 */
const authenticationMiddleware = catchAsync(async (req, res, next) => {
    // Extract the token from signed cookies
    const token = req.signedCookies.token
    // Check if token exists
    if (!token)
        throw new UnauthenticatedError('Authentication Token not found!', StatusCodes.UNAUTHORIZED);

    try {
        // Verify the token and extract payload
        const payload = isTokenValid({ token })
        // Set user information in the request object
        req.user = {
            name: payload.name, // User's name
            userId: payload._id, // User's ID
            role: payload.role // User's role
        }

        // Passing control to the next middleware in the stack
        next();
    } catch (error) {
        // Handling unauthorized access error
        throw new UnauthenticatedError('Not authorized to access this route');
    }
})



/** Middleware for user authorization
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 * @param {Function} next - Express next middleware function
 * @param {INSERT} roles - Express request object. Contains information about the client's request.
 */
const authorizePermissions = (...roles) => {
    // INSERT COMMENT HERE
    return (req, res, next) => {
        // INSERT COMMENT HERE
        if (!roles.includes(req.user.role))
            throw new UnauthorizedError('Not authorized to access this route');
        // Passing control to the next middleware in the stack
        next();
    }
}


module.exports = {
    authenticationMiddleware,
    authorizePermissions
}