import { comparePassword } from "../../utils/hashPassword.js";
import { GraphQLError } from "graphql";
import { signToken } from "../../utils/signToken.js";
import { ROLES } from "../../utils/constants.js";
import User from '../../models/User.js';

export default {
    Mutation: {
        login: async(_, { email, password}) => {
            // Find the user and explicitly include the password field
            const user = await User.findOne({email: email.toLowerCase()}).select('+password');

            if(!user){
                throw new GraphQLError('Invalid credentials', {
                    extensions: {code: 'UNAUTHENTICATED'},
                });
            }

            //Clients don't authenticate - They have no password to compare against (They have no account even)
            if(user.role === ROLES.CLIENT){
                throw new GraphQLError('This account type cannot log in', {
                    extensions: {code: 'FORBIDDEN'},
                });
            }

            const isValid = await comparePassword(password, user.password);

            if (!isValid){
                throw new GraphQLError('INvalid credentials', {
                    extensions: {code: 'UNAUTHENTICATED'},
                });
            }

            const token = signToken(user);

            return {
                token,
                user,
            };
        },
    },
};