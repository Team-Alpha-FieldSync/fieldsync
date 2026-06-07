/**
 * updateAdmin.js
 *
 * Usage:
 *   node src/scripts/updateAdmin.js 
 *   --currentEmail=old@admin.com [--email=new@admin.com] [--name="New Name"] [--password=NewPass123]
 *
 * Adds an additional admin if the following flags are provided:
 *   --newAdminEmail=admin2@admin.com 
 *   --newAdminPassword=Secret123 [--newAdminName="Second Admin"]
 *
 * This script updates an existing admin's email/name/password
 * and can optionally create a second admin account.
 * 
 * Easy access: npm update-admin (instead of node src/scripts/updateAdmin.js)
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import { hashPassword } from '../utils/hashPassword.js';
import { ROLES } from '../utils/constants.js';

const parseArgs = (argv) => {
  return Object.fromEntries(
    argv.map((arg) => {
      const [rawKey, ...rest] = arg.replace(/^--/, '').split('=');
      return [rawKey, rest.join('=')];
    })
  );
};

const args = parseArgs(process.argv.slice(2));

const currentEmail = args.currentEmail?.toLowerCase();
const updateEmail = args.email?.toLowerCase();
const updateName = args.name;
const updatePassword = args.password;

const extraAdminEmail = args.newAdminEmail?.toLowerCase();
const extraAdminPassword = args.newAdminPassword;
const extraAdminName = args.newAdminName || 'Additional Admin';

const main = async () => {
  await connectDB();

  if (!currentEmail) {
    throw new Error('Please provide --currentEmail=<admin email> to identify the admin to update.');
  }

  const admin = await User.findOne({ email: currentEmail, role: ROLES.ADMIN }).select('+password');

  if (!admin) {
    throw new Error(`No admin found with email: ${currentEmail}`);
  }

  const updates = {};
  if (updateEmail) updates.email = updateEmail;
  if (updateName) updates.name = updateName;
  if (updatePassword) updates.password = await hashPassword(updatePassword);

  if (Object.keys(updates).length > 0) {
    const updatedAdmin = await User.findByIdAndUpdate(
      admin._id,
      updates,
      { returnDocument: 'after' }
    );
    console.log(`Updated admin: ${updatedAdmin.email}`);
  } else {
    console.log('No update fields provided for existing admin.');
  }

  if (extraAdminEmail && extraAdminPassword) {
    const existing = await User.findOne({ email: extraAdminEmail });
    if (existing) {
      console.log(`Skipping creation: admin already exists with email ${extraAdminEmail}`);
    } else {
      const hashedPassword = await hashPassword(extraAdminPassword);
      const newAdmin = await User.create({
        name: extraAdminName,
        email: extraAdminEmail,
        password: hashedPassword,
        role: ROLES.ADMIN,
        isActive: true,
      });
      console.log(`Created additional admin: ${newAdmin.email}`);
    }
  }

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});