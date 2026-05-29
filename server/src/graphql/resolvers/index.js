import authResolvers from './auth.js';
import userResolvers from './user.js';
import jobResolvers from './job.js';
import enumResolvers from './enums.js'
import statsResolvers from './stats.js'
import notificationResolvers from './notification.js';
import stats from './stats.js';

//Merging resolvers from each file.
//Each one contributes its fields, and any type-level field resolvers.

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...jobResolvers.Query,
        ...notificationResolvers.Query,
        ...statsResolvers.Query,
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

    ...enumResolvers,
};

export default resolvers;