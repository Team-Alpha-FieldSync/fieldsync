import mongoose from 'mongoose';
import { REPORT_STATUS } from '../utils/constants.js';

const reportSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 5000,
        },
        status: {
            type: String,
            enum: Object.values(REPORT_STATUS),
            default: REPORT_STATUS.PENDING,
        },
        submittedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

reportSchema.index({ technician: 1, status: 1 });

export default mongoose.model('Report', reportSchema);