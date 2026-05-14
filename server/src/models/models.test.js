import 'dotenv/config';
import mongoose from 'mongoose';
import User from './User.js';
import Job from './Job.js';
import Notification from './Notification.js';

const test = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');

    //Trying to create client(No password - Should succeed)
    try{
        const client = await User.create({
            name:'Text Client',
            email: `test-${Date.now()}@example.com`,
            role: 'client',
        });
        console.log('Created client:', client._id.toString());
    }catch(err){
        console.log('Client creation failed:', err.message);
    }

    //Trying to create a technician without password (Needs password - Should fail)
    try{
        await User.create({
            name: 'Bad Technician',
            email: `bad-${Date.now()}@example.com`,
            role: 'technician',
        });
        console.error('ERROR: technician without password was allowed!');
    }catch(err){
        console.log('Correctly rejected technician without password');
    }

    //Try creating a user with invalid role (Needs valid role - Should fail)
    try{
        await User.create({
            name: 'Invalid',
            email: `invalid-${Date.now()}@example.com`,
            role: 'superuser',
        });
        console.error('ERROR, invalid role was allowed!');
    }catch (err){
        console.log('Correctly rejected invalid role');
    }

    await mongoose.disconnect();
    console.log('Done');
};

test();