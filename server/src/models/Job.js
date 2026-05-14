import mongoose from 'mongoose';

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
        status: {
            type: String,
            required: true,
            enum: {
                values: ['pending', 'in_progress', 'completed','verified'],
                message: '{VALUE} is not a valid status',
            },
            default: 'pending',
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