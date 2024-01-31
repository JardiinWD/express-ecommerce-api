// Importing the catchAsync function
const catchAsync = require('./../utilities/catchAsync');
// Importing User Model
// const User = require('./../models/User');
// Importing the Status Code Package
const { StatusCodes } = require('http-status-codes');
// Importing the BadRequest error handler
const { UnauthenticatedError } = require('./../errors/index');
// Importing the jwtoken for generating a unique token
const JWToken = require('jsonwebtoken');


/** Middleware for user authentication
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 * @param {Function} next - Express next middleware function
 */
const authenticationMiddleware = catchAsync(async (req, res, next) => {
    // Extracting authorization header from the request
    const authHeader = req.headers.authorization
    // Checking if authorization header is missing or not in the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('No token provided', StatusCodes.BAD_REQUEST);
    }

    // Extracting the token from the authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verifying and decoding the JWT token
        const decoded = JWToken.verify(token, process.env.JWT_SECRET);
        // Attach the user to the jobs route
        req.user = {
            userId: decoded.userId,
            name: decoded.name
        }
        // Passing control to the next middleware in the stack
        next();
    } catch (error) {
        // Handling unauthorized access error
        throw new UnauthenticatedError('Not authorized to access this route', StatusCodes.UNAUTHORIZED);
    }
})

module.exports = authenticationMiddleware