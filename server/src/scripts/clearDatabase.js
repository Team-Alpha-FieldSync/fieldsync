/**
 * clearDatabase.js
 *
 * Usage:
 *   node src/scripts/clearDatabase.js
 *
 * This script removes all jobs, notifications, and reports,
 * deletes all non-admin users, and resets the technician/client
 * sequence counters back to 0.
 *
 * Important:
 *   - Existing admin accounts are preserved.
 *   - Run from `fieldsync/server` or via npm script.
 * 
* Easy access: npm run clear-db (instead of node src/scripts/clearDatabase.js)
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import Report from '../models/Report.js';
import Counter from '../models/Counter.js';
import { ROLES } from '../utils/constants.js';

const main = async () => {
  await connectDB();

  console.log('Clearing non-admin users and main collections...');
  await Promise.all([
    User.deleteMany({ role: { $ne: ROLES.ADMIN } }),
    Job.deleteMany({}),
    Notification.deleteMany({}),
    Report.deleteMany({}),
  ]);

  console.log('Resetting counter sequences...');
  await Promise.all([
    Counter.updateOne(
      { _id: 'technician' },
      { $set: { seq: 0 } },
      { upsert: true }
    ),
    Counter.updateOne(
      { _id: 'client' },
      { $set: { seq: 0 } },
      { upsert: true }
    ),
  ]);

  console.log('Database cleared and counters reset.');
  await mongoose.disconnect();
};

main().catch((error) => {
  console.error('Failed to reset database:', error);
  process.exit(1);
});