// Custom error class to represent API errors with specific status codes
class CustomAPIError extends Error {
  // Constructor for the CustomAPIError class
  constructor(message, statusCode) {
    // Call the superclass constructor with the provided error message
    super(message);
    // Store the provided status code in the object
    this.statusCode = statusCode;
  }
}
module.exports = CustomAPIError
