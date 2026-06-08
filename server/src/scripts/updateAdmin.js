/**
 * updateAdmin.js — Manage admin accounts from the command line.
 *
 * In the examples below, anything inside <angle brackets> is a
 * placeholder you must replace with your real value. Do not type the
 * < and > characters themselves.
 *
 *   Example:  --email=<admin@fieldsync.com>
 *   You type: --email=admin@fieldsync.com
 *
 * Run all commands from the `server/` directory and put everything on
 * one line (PowerShell does not understand backslash line continuation).
 *
 *   Update an existing admin (change name and/or password):
 *     npm run admin:update -- --email=<existing@admin.com> --name=<"New Name"> --password=<NewPass>
 *
 *   Change an admin's email:
 *     npm run admin:update -- --email=<old@admin.com> --new-email=<new@admin.com>
 *
 *   Create a brand-new admin:
 *     npm run admin:create -- --email=<new@admin.com> --password=<Secret> --name=<"Display Name">
 *
 *   Show help:
 *     npm run admin -- --help
 *
 * Notes:
 *   • The bare "--" after the script name is required so npm forwards
 *     the flags to this script.
 *   • Flag names are case- and dash-insensitive
 *     (--new-email, --newEmail, --NEW_EMAIL all work).
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import { hashPassword } from '../utils/hashPassword.js';
import { ROLES } from '../utils/constants.js';

// ─────────────────────────────────────────────────────────────────────
// Argument parsing
// ─────────────────────────────────────────────────────────────────────

// Normalize "newEmail", "new-email", "NEW_EMAIL" → "newemail" so the
// caller can use whichever style feels natural.
const normalizeKey = (key) => key.toLowerCase().replace(/[-_]/g, '');

/**
 * Collect flags from BOTH sources:
 *   1. process.argv          (works when `--` separator is used)
 *   2. process.env.npm_config_*  (npm's fallback when `--` is omitted;
 *                                 npm lowercases the key for us)
 * argv wins if both are present.
 */
const collectFlags = () => {
  const flags = {};

  // 1. npm_config_* env vars (npm always lowercases these keys)
  for (const [envKey, value] of Object.entries(process.env)) {
    if (!envKey.startsWith('npm_config_')) continue;
    const key = normalizeKey(envKey.slice('npm_config_'.length));
    if (!key || value === '') continue;
    flags[key] = value;
  }

  // 2. process.argv (highest priority — overwrites env values)
  const positional = [];
  for (const arg of process.argv.slice(2)) {
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }
    const stripped = arg.replace(/^--/, '');
    const eq = stripped.indexOf('=');
    const rawKey = eq === -1 ? stripped : stripped.slice(0, eq);
    const value = eq === -1 ? 'true' : stripped.slice(eq + 1);
    flags[normalizeKey(rawKey)] = value;
  }

  return { flags, positional };
};

const { flags, positional } = collectFlags();

// Subcommand is the first positional arg ("update" / "create"),
// or inferred from --new-admin-email for back-compat.
const subcommand = (positional[0] || '').toLowerCase();

// ─────────────────────────────────────────────────────────────────────
// Help text
// ─────────────────────────────────────────────────────────────────────

const HELP = `
Admin account management

In the examples, <angle brackets> mark placeholders — replace them
with your real values and do NOT type the < and > characters.

Usage:
  npm run admin:update -- --email=<existing@admin.com> [--new-email=<new@admin.com>] [--name=<"Name">] [--password=<NewPass>]
  npm run admin:create -- --email=<new@admin.com> --password=<Secret> [--name=<"Name">]
  npm run admin       -- --help

Flags for "update":
  --email          Email of the existing admin to look up (REQUIRED)
  --new-email      New email to assign (optional)
  --name           New display name (optional)
  --password       New password (optional)

Flags for "create":
  --email          Email for the new admin (REQUIRED)
  --password       Password for the new admin (REQUIRED)
  --name           Display name (optional, defaults to "Admin")

Tips:
  • The bare "--" after the npm script name is required so npm
    forwards your flags to this script.
  • Flag names are case- and dash-insensitive
    (--new-email == --newEmail == --NEW_EMAIL).
  • Run from the server/ directory, on a single line.
`;

const printHelpAndExit = (code = 0) => {
  console.log(HELP);
  process.exit(code);
};

if (flags.help || flags.h) printHelpAndExit(0);

// ─────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────

const runUpdate = async () => {
  const email = flags.email?.toLowerCase();
  const newEmail = flags.newemail?.toLowerCase();
  const newName = flags.name;
  const newPassword = flags.password;

  if (!email) {
    throw new Error(
      'Missing --email. Provide the existing admin\'s email so we know which account to update.\n' +
        'Run "npm run admin -- --help" for examples.',
    );
  }

  const admin = await User.findOne({ email, role: ROLES.ADMIN }).select('+password');
  if (!admin) {
    throw new Error(`No admin found with email: ${email}`);
  }

  const updates = {};
  if (newEmail) updates.email = newEmail;
  if (newName) updates.name = newName;
  if (newPassword) updates.password = await hashPassword(newPassword);

  if (Object.keys(updates).length === 0) {
    console.log('Nothing to update — pass at least one of --new-email, --name, --password.');
    return;
  }

  const updated = await User.findByIdAndUpdate(admin._id, updates, {
    returnDocument: 'after',
  });
  console.log(`✓ Updated admin: ${updated.email} (name: ${updated.name})`);
};

const runCreate = async () => {
  const email = flags.email?.toLowerCase();
  const password = flags.password;
  const name = flags.name || 'Admin';

  if (!email || !password) {
    throw new Error(
      'Creating an admin requires both --email and --password.\n' +
        'Run "npm run admin -- --help" for examples.',
    );
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error(`A user already exists with email: ${email}`);
  }

  const created = await User.create({
    name,
    email,
    password: await hashPassword(password),
    role: ROLES.ADMIN,
    isActive: true,
  });
  console.log(`✓ Created admin: ${created.email} (name: ${created.name})`);
};

// ─────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────

const main = async () => {
  if (!subcommand) {
    console.error('Missing subcommand. Use "update" or "create".\n');
    printHelpAndExit(1);
  }
  if (!['update', 'create'].includes(subcommand)) {
    console.error(`Unknown subcommand: "${subcommand}". Use "update" or "create".\n`);
    printHelpAndExit(1);
  }

  await connectDB();
  try {
    if (subcommand === 'update') await runUpdate();
    if (subcommand === 'create') await runCreate();
  } finally {
    await mongoose.disconnect();
  }
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
