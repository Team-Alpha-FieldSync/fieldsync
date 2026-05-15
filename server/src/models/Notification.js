import mongoose from 'mongoose';
import { NOTIFICATION_TYPE } from '../utils/constants.jsc';

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: false,
        },
        type: {
            type: String,
            required: true,
            enum: {
                values: Object.values(NOTIFICATION_TYPE),
                message: '{VALUE} is not a valid notification type',
            },
        },
        message: {
            type: String, 
            required: true,
            trim: true,
            maxlength: 500,
        },
        read: {
            type: Boolean,
            default: false,
        },
        delivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

//Index for typical notification queries
notificationSchema.index({user:1, read:1});
notificationSchema.index({user:1, createdAt: -1});

export default mongoose.model('Notification', notificationSchema);