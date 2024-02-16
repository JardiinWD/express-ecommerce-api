const catchAsync = require("../utilities/catchAsync");

/** Controller function for getting all users
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getAllUsers = catchAsync(async (req, res) => {
    // CONTROLLER TO GET ALL USERS
})

/** Controller function for getting a single user
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getSingleUser = catchAsync(async (req, res) => {
    // CONTROLLER TO GET A SINGLE USER
})

/** Controller function for showing current user
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const showCurrentUser = catchAsync(async (req, res) => {
    // CONTROLLER TO SHOW CURRENT USER
})

/** Controller function for updating a user
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const updateUser = catchAsync(async (req, res) => {
    // CONTROLLER TO UPDATE A USER
})

/** Controller function for updating a user's password
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const updateUserPassword = catchAsync(async (req, res) => {
    // CONTROLLER TO UPDATE A USER'S PASSWORD
})

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}
