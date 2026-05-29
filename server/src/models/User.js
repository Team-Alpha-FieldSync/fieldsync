import mongoose from 'mongoose';
import { AVAILABILITY, JOB_CATEGORY, ROLES } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            // Required only for users who log in (admin, technician).
            // Clients don't authenticate
            required: function () {
                return this.role !== ROLES.CLIENT;
            },
            minlength: 8,
            // exclude from queries by default; explicitly select for login
            select: false, 
        },
        role: {
            type: String,
            required: true,
            enum: {
                values: Object.values(ROLES),
                message: '{VALUE} is not a valid role',
            },
        },
        phone: {
            type: String,
            trim: true,
            maxlength: 30,
        },
        specialization: {
            type: String,
            enum: {
                values: Object.values(JOB_CATEGORY),
                message: '{VALUE} is not a valid specialization',
            },
            required: function(){
                return this.role === ROLES.TECHNICIAN;
            },
        },
        availability: {
            type: String,
            enum: {
                values: Object.values(AVAILABILITY),
                message: '{VALUE} is not a valid availability'
            },
            default: AVAILABILITY.AVAILABLE,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, //null for seeded admins; populated for everyone else
        },
    },
    {
        timestamps: true,
    }
);



export default mongoose.model('User', userSchema);