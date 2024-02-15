
// Importing Status code from http-status-codes library
const { StatusCodes } = require('http-status-codes')

/** Express middleware for handling errors and sending a standardized JSON response
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 */
const errorHandlerMiddleware = (err, req, res, next) => {

  // Default custom error object
  let customError = {
    // Set Default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, // Default status code
    message: err.message || 'Something went wrong, try again later' // Default error message
  }

  // MongoDB -> Duplicate Error
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value` // Message for duplicate key error
    customError.statusCode = StatusCodes.NOT_FOUND // Status code for duplicate key error
  }

  // MongoDB -> Validation Error
  if (err.name === 'ValidationError') {
    // Construct error message from validation errors
    customError.message = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST // Status code for validation error
  }

  // MongoDB -> Cast Error
  if (err.name === 'CastError') {
    // Construct error message for cast error
    customError.message = `No item found with the id ${Object.keys(err.value)}`
    customError.statusCode = StatusCodes.BAD_REQUEST // Status code for cast error
  }

  return res.status(customError.statusCode).json({
    error: err,
    message: customError.message // Error message describing the issue
  })
}



module.exports = errorHandlerMiddleware
