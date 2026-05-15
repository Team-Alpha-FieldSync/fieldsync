import authResolvers from './auth.js';
import userResolvers from './user.js';
import jobResolvers from './job.js';
import notificationResolvers from './notification.js';

//Merging resolvers from each file.
//Each one contributes its fields, and any type-level field resolvers.

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...jobResolvers.Query,
        ...notificationResolvers.Query,
    },
    Mutation: {
        ...authResolvers.Mutation,
        ...userResolvers.Mutation,
        ...jobResolvers.Mutation,
        ...notificationResolvers.Mutation,
    },
    //Type-level field resolvers
    User: userResolvers.User,
    Job: jobResolvers.Job,
    Notification: notificationResolvers.Notification,
};

export default resolvers;