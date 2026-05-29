import mongoose from 'mongoose';
import { JOB_CATEGORY, JOB_STATUS, JOB_PRIORITY } from '../utils/constants.js';

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
            minlength: 3,
            maxlength: 200,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: 5000,
        },
        location:{
            type: String,
            required: [true, 'Location is required'],
            trim: true,
            maxlength: 500,
        }, 
        priority: {
            type: String,
            enum: {
                values: Object.values(JOB_PRIORITY),
                message: '{VALUE} is not a valid priority',
            },
            default: JOB_PRIORITY.MEDIUM,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: Object.values(JOB_CATEGORY),
                message: '{Value} is not a valid category',
            },
        },
        deadline: {
            type: Date,
            required: [true, 'Deadline is required'],
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: Object.values(JOB_STATUS),
                message: '{VALUE} is not a valid status',
            },
            default: JOB_STATUS.PENDING,
        },
        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A technician must be assigned'],
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A client must be linked'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'createdBy is required'],
        },
    },
    {
        timestamps: true,
    }
);

//Indexes for the queries that will actually be return
jobSchema.index({technician: 1, status: 1});//Technician Dashboard
jobSchema.index({status: 1});               //Admin filter by status
jobSchema.index({client: 1});               //jobs for a specific client
jobSchema.index({createdAt: -1});           //newest-first sort

export default mongoose.model('Job', jobSchema);