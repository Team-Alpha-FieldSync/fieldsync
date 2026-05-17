import {verifyToken} from '../utils/signToken.js'

/** 
 * Extract and verify the JWT from an incoming request.
 *
 * Reads the Authorization header, validates the format, verifies the token,
 * and returns the decoded user payload — or null if anything is wrong.
 *
 * This is called by Apollo Server's context function on every request.
 * Resolvers read `context.user` and use the role guards to enforce access.
 *
 * @param {object} req - The Express request object
 * @returns {object | null} Decoded user payload or null
 */

export const getUserFromRequest = (req) => {
    const header = req.headers.authorization || '';

    //Expected format: "Bearer <token>"
    if (!header.startsWith('Bearer ')){
        return null;
    }

    //Strip Bearer
    const token = header.slice(7);

    if (!token){
        return null;
    }

    //verifyToken returns null on invalid/expired tokens
    return verifyToken(token);
    
};