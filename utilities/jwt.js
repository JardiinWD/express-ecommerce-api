// Importing the jwtoken for generating a unique token
const JWToken = require('jsonwebtoken');
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Importing the Status Code Package
const { StatusCodes } = require('http-status-codes');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: '../config.env' })


/** Function to create a JSON Web Token (JWT)
 * @param {Object} payload - Data to be included in the token payload
 * @returns {string} - Generated JWT
 */
const createJWT = ({ payload }) => {
    // Generate a JWT with the provided payload and configuration
    const token = JWToken.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })

    // Return the generated token
    return token
}


/** Function to verify the validity of a JWT
 * @param {string} token - JWT to be verified
 * @returns {Object} - Decoded JWT payload if the token is valid
 */
const isTokenValid = ({ token }) => {
    // Verify the validity of the token and return the decoded payload
    return JWToken.verify(token, process.env.JWT_SECRET)
}

/** Function to attach JWT as a cookie to the response object
 * @param {Object} res - Express response object
 * @param {Object} user - User object to be included in the JWT payload
 * @returns {void}
 */
const attachCookiesToResponse = ({ res, user }) => {
    // Create a JWT using the provided user object
    const tokenToAttach = createJWT({
        payload: user
    })

    // Set the expiration duration for the token
    const expiresDay = 1000 * 60 * 60 * 24

    // Attach the token as a cookie to the response
    res.cookie('token', tokenToAttach, {
        httpOnly: true, // Make the cookie accessible only via HTTP(S)
        expires: new Date(Date.now() + expiresDay), // Set the expiration date for the cookie
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
        signed: true // Signs the cookie to prevent tampering
    })

}



// Export the functions for use in other modules
module.exports = { createJWT, isTokenValid, attachCookiesToResponse }

