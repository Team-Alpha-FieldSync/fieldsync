import Job from '../models/Job.js';
import User from '../models/User.js';
import { JOB_STATUS, AVAILABILITY, ROLES } from './constants.js';

/**
 * Keeps User.availability in sync with active job assignments.
 * A technician is unavailable while they have pending or in-progress jobs.
 */
export async function syncTechnicianAvailability(technicianId) {
  if (!technicianId) return;

  const activeCount = await Job.countDocuments({
    technician: technicianId,
    status: { $in: [JOB_STATUS.PENDING, JOB_STATUS.IN_PROGRESS] },
  });

  await User.findByIdAndUpdate(technicianId, {
    availability:
      activeCount > 0 ? AVAILABILITY.UNAVAILABLE : AVAILABILITY.AVAILABLE,
  });
}

/** Corrects availability for all technicians (e.g. on server start). */
export async function syncAllTechnicianAvailability() {
  const technicians = await User.find({ role: ROLES.TECHNICIAN }).select('_id');
  await Promise.all(
    technicians.map((tech) => syncTechnicianAvailability(tech._id)),
  );
}
