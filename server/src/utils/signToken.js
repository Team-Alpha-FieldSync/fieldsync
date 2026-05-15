import jwt from 'jsonwebtoken';

/*
 * Sign a JWT for an authenticated user.
 * Called from the login resolver after credentials are verified.
 
 * @param {object} user - The user document (or any object with _id, role, email)
 * @returns {string} A signed JWT, ready to send back to the client
 */

//Function that signs the user using the payload
export const signToken = (user) => {
    const payload = {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/*
 * Verify and decode a JWT.
 * Called from the auth middleware on every incoming request.
 
 * @param {string} token - The JWT string (without the "Bearer " prefix)
 * @returns {object | null} The decoded payload, or null if invalid/expired
*/

//Verifies the signed payload
export const verifyToken = (token) => {
    try{
        return jwt.verify(token, process.env.JWT_SECRET);
    }catch (err){
        // Invalid signature, expired, malformed - treat as no auth.
        // Resolvers will see context.user as null and the role guards
        // will throw "You must be logged in".
        return null;
    }
};