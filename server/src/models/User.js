import mongoose from 'mongoose';

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
                return this.role !== 'client';
            },
            minlength: 8,
            // exclude from queries by default; explicitly select for login
            select: false, 
        },
        role: {
            type: String,
            required: true,
            enum: {
                values: ['admin', 'technician', 'client'],
                message: '{VALUE} is not a valid role',
            },
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