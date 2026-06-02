import { GraphQLError } from "graphql";
import Job from "../../models/Job.js";
import User from '../../models/User.js'
import Notification from '../../models/Notification.js';
import {requireAuth} from '../../guards/roles.js';
import {ROLES, NOTIFICATION_TYPE} from '../../utils/constants.js';

export default {
    Query: {
        myNotifications: async (_, {unreadOnly}, {user}) => {
            requireAuth(user);
            
            const filter = {user: user.userId};
            if(unreadOnly) filter.read = false;

            return Notification.find(filter).sort({createdAt: -1});
        },
    },

    Mutation: {
        markNotificationRead: async (_, {id}, {user}) => {
            requireAuth(user);

            const notification = await Notification.findById(id);
            if(!notification){
                throw new GraphQLError('Notification not found', {
                    extensions: {code: 'NOT_FOUND'},
                });
            }

            //Users can only mark their own notifications as read
            if(notification.user.toString() !== user.userId){
                throw new GraphQLError('You can only modify your own notifications', {
                    extensions: {code: 'FORBIDDEN'},
                });
            }

            notification.read = true;
            await notification.save();
            
            return notification;
        },

        reportIssue: async (_, {jobId, message}, {user}) => {
            requireTechnician(user);
            const job = await Job.findById(jobId);
            if(!job){
                throw new GraphQLError('Job not found', {
                    extensions: {code: 'NOT_FOUND'},
                });
            }

            //Technicians can only flag issues on their own jobs
            if(user.role === ROLES.TECHNICIAN && job.technician.toString() !== user.userId){
                throw new GraphQLError('You can only report issues on your own jobs', {
                    extensions: {code: 'FORBIDDEN'},
                });
            }

            //Notify the admin who created the job
            return Notification.create({
                user: job.createdBy,
                job: jobId,
                type: NOTIFICATION_TYPE.SYSTEM_ALERT,
                message,
            });
        },
    },

    //Field resolvers
    Notification: {
        user: async (parent) => User.findById(parent.user),
        job: async (parent) => Job.findById(parent.job),
        createdAt: (parent) => parent.createdAt.toISOString() ?? null,
        deliveredAt: (parent) => parent.deliveredAt.toISOString() ?? null,
    },
};