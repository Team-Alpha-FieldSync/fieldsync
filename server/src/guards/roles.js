import {GraphQLError} from 'graphql';
import { ROLES } from '../utils/constants.js';

export const requireAuth = (user) => {
    if(!user){
        throw new GraphQLError('You must be logged in', {
            extensions: {code: 'UNAUTHENTICATED'},
        });
    }
};

export const requireAdmin =(user) => {
    requireAuth(user);
    if(user.role !== ROLES.ADMIN){
        throw new GraphQLError('Admin access required', {
            extensions: {code: 'FORBIDDEN'},
        });
    }
};

export const requireTechnician = (user) => {
    requireAuth(user);
    if(user.role !== ROLES.TECHNICIAN){
        throw new GraphQLError('Technician access required', {
            extensions: {code: 'FORBIDDEN'},
        });
    }
};