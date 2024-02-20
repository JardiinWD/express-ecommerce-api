// Importing the catchAsync function
const catchAsync = require('./../utilities/catchAsync');
// Importing Order Model
const Order = require('./../models/Order');
// Importing the Status Code Package
const { StatusCodes } = require('http-status-codes');
// Importing the BadRequest error handler
const { BadRequestError, UnauthenticatedError, CustomAPIError } = require('./../errors/index');
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: '../config.env' })
// Importing the createJWT function created on utilities folder
const { attachCookiesToResponse, createTokenUser } = require('../utilities/index')


/** Controller function for retrieving all orders
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getAllOrders = catchAsync(async (req, res) => {
    res.send('getAllOrders')
});

/** Controller function for retrieving a single order
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getSingleOrder = catchAsync(async (req, res) => {
    res.send('getSingleOrder')
});


/** Controller function for retrieving the current user's order
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getCurrentUserOrder = catchAsync(async (req, res) => {
    res.send('getCurrentUserOrder')
});


/** Controller function for creating an order
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const createOrder = catchAsync(async (req, res) => {
    res.send('createOrder')
});


/** Controller function for updating an order
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const updateOrder = catchAsync(async (req, res) => {
    res.send('updateOrder')
});


// Exports all functionality from here
module.exports = {
    updateOrder,
    createOrder,
    getCurrentUserOrder,
    getSingleOrder,
    getAllOrders
};