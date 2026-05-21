import bcrypt from 'bcryptjs';

//Salt Rounds (The higher, the more securer, but slower)
const SALT_ROUNDS = 10;

/*
* Hash a plain text password using bcrypt
*Must use before saving any new user's password to the database.

*@param {string} plainPassword - The plain text password to Hash
*@returns {Promise<string>}- The bcrypt hash (60 chars, includes salt)
*/

//Hashing Password
export const hashPassword = async (plainPassword) => {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/*
*Compare plain text password against stored bcrypt hash
*Must use during login to verify credentials

* @param {string} plainPassword - The password the user just typed
* @param {string} hashedPassword - The bcrypt hash stored in the database
* @returns {Promise<boolean>} true if the password matches, false otherwise
*/

//Comparing current password to stored hashed password
export const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
}