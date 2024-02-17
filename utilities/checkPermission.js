// Importing the Unauthorized error handler
const { UnauthorizedError } = require('./../errors/index');

/** Function to check user permission for accessing a resource
 * @param {Object} requestUser - User object from the request
 * @param {String} resourceUserId - ID of the user associated with the resource
 */
const checkPermission = (requestUser, resourceUserId) => {
    // Check if the user is an admin
    if (requestUser.role === 'admin') return
    // Check if the user ID matches the resource's user ID
    if (requestUser.userId === resourceUserId.toString()) return
    // If neither condition is met, throw an unauthorized error
    throw new UnauthorizedError('Not authorized to access this route')
}

module.exports = checkPermission
