// Importing Status code from http-status-codes library
const { StatusCodes } = require('http-status-codes')
// Importing customAPIError handler
const CustomAPIError = require('./custom-api');

// Custom error class to represent Unauthenticated errors with specific status codes
class UnauthorizedError extends CustomAPIError {
    // Constructor for the CustomAPIError class
    constructor(message) {
        // Call the superclass constructor with the provided error message
        super(message);
        // Store the provided status code in the object
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = UnauthorizedError;
