import User from '../models/User.js';
import { getNextSequence } from '../models/Counter.js';
import { ROLES } from './constants.js';

/** Assigns clientNumber to legacy clients created before sequencing existed. */
export async function backfillClientNumbers() {
  const clients = await User.find({
    role: ROLES.CLIENT,
    clientNumber: null,
  }).sort({ createdAt: 1 });

  for (const client of clients) {
    client.clientNumber = await getNextSequence('client');
    await client.save();
  }
}
