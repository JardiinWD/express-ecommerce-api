/** Function to create token user object
 * @param {Object} user - User object
 * @returns {Object} - Token user object containing user's name, ID, email, and role
 */
const createTokenUser = (user) => {
    return {
        name: user.name, // User's name
        userId: user._id, // User's ID
        email: user.email, // User's email
        role: user.role // User's role
    }
}

module.exports = createTokenUser
