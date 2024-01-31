
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

  // INSERT COMMENT HERE
  let customError = {
    // Set Default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, try again later'
  }

  // MongoDB -> Duplicate Error
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  // MongoDB -> Validation Error
  if (err.name === 'ValidationError') {
    // INSERT COMMENT HERE
    customError.message = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // MongoDB -> Cast Error
  if (err.name === 'CastError') {
    // INSERT COMMENT HERE
    customError.message = `No item found with the id ${Object.keys(err.value)}`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }


  return res.status(customError.statusCode).json({
    error: err,
    message: customError.message // Error message describing the issue
  })
}



module.exports = errorHandlerMiddleware
