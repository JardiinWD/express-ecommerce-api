// Importing the catchAsync function
const catchAsync = require('./../utilities/catchAsync');
// Importing User Model
const User = require('./../models/User');
// Importing the Status Code Package
const { StatusCodes } = require('http-status-codes');
// Importing the BadRequest error handler
const { BadRequestError, UnauthenticatedError } = require('./../errors/index');
// Importing the jwtoken for generating a unique token
const JWToken = require('jsonwebtoken');

/** Controller function for user login
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const login = catchAsync(async (req, res) => {
    res.send('Login Controller')
});

/** Controller function for user logout
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const logout = catchAsync(async (req, res) => {
    res.send('Logout Controller')
});

/** Controller function for user registration
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const register = catchAsync(async (req, res) => {
    const user = await User.create(req.body)
    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            user
        }
    })

});

// Exporting the Register and Login controller
module.exports = {
    register,
    login,
    logout
};
