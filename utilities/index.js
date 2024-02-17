// ======= JWT IMPORT ======= //
const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser')
const checkPermission = require('./checkPermission')



// ======= EXPORTS ======= //
module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser,
    checkPermission
}