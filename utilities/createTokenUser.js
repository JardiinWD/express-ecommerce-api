
/** INSERT COMMENT HERE
 * @param {INSERT} user  INSERT COMMENT HERE
 */
const createTokenUser = (user) => {
    return {
        name: user.name, // User's name
        userId: user._id, // User's ID
        role: user.role // User's role
    }
}

module.exports = createTokenUser