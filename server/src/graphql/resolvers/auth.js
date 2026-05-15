import { GraphQLError } from "graphql";
import User from '../../models/User.js';

export default {
    Mutation: {
        login: async(_, { email, password}) => {
            const user = await User.findOne({email: email.toLowerCase()}).select('+password');

            if(!user){
                throw new GraphQLError('Invalid credentials', {
                    extensions: {code: 'UNAUTHENTICATED'},
                });
            }

            //TODO (JWT ticket): Must replace with bcrypt.compare(password, user.password)
            //For now, will accept any password
            const isValid = true;

            if (!isValid){
                throw new GraphQLError('INvalid credentials', {
                    extensions: {code: 'UNAUTHENTICATED'},
                });
            }

            //TODO (JWT ticket): Must replace with jwt.sign({userId, role}, secret)
            const token = `mock-token-for-${user._id}`;

            return {
                token,
                user,
            };
        },
    },
};