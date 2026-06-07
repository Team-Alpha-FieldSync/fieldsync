import Notification from '../models/Notification.js';
import { NOTIFICATION_TYPE } from '../utils/constants.js';

export function formatJobCode(job) {
  return job.jobNumber != null
    ? `JOB-${job.jobNumber}`
    : `JOB-${job._id.toString().slice(-6)}`;
}

export async function createNotification({ userId, jobId, type, message }) {
  if (!userId) return null;

  return Notification.create({
    user: userId,
    job: jobId ?? undefined,
    type,
    message,
    delivered: true,
    deliveredAt: new Date(),
  });
}

/** Technician receives a new job assignment. */
export async function notifyJobAssigned(job) {
  const code = formatJobCode(job);
  return createNotification({
    userId: job.technician,
    jobId: job._id,
    type: NOTIFICATION_TYPE.JOB_ASSIGNED,
    message: `You have been assigned ${code}: "${job.title}".`,
  });
}

/** Previous technician is informed when a pending job is reassigned away. */
export async function notifyJobReassignedAway(job, previousTechnicianId) {
  if (!previousTechnicianId) return null;
  if (previousTechnicianId === job.technician.toString()) return null;

  const code = formatJobCode(job);
  return createNotification({
    userId: previousTechnicianId,
    jobId: job._id,
    type: NOTIFICATION_TYPE.JOB_UPDATED,
    message: `${code} "${job.title}" has been reassigned to another technician.`,
  });
}

/** Admin is informed when a technician changes job status (e.g. starts work). */
export async function notifyJobStatusChanged(job, newStatus, actorName) {
  const code = formatJobCode(job);
  const statusLabel = newStatus.replace(/_/g, ' ');
  return createNotification({
    userId: job.createdBy,
    jobId: job._id,
    type: NOTIFICATION_TYPE.JOB_UPDATED,
    message: `${actorName ?? 'Technician'} moved ${code} to ${statusLabel}.`,
  });
}

/** Admin is informed when a technician completes a job. */
export async function notifyJobCompleted(job, technicianName) {
  const code = formatJobCode(job);
  return createNotification({
    userId: job.createdBy,
    jobId: job._id,
    type: NOTIFICATION_TYPE.JOB_COMPLETED,
    message: `${technicianName ?? 'Technician'} completed ${code}: "${job.title}".`,
  });
}

/** Technician is informed when an admin verifies their completed job. */
export async function notifyJobVerified(job) {
  const code = formatJobCode(job);
  return createNotification({
    userId: job.technician,
    jobId: job._id,
    type: NOTIFICATION_TYPE.JOB_VERIFIED,
    message: `${code} "${job.title}" has been verified and closed.`,
  });
}

/** Technician is informed when an admin cancels their job. */
export async function notifyJobCancelled(job) {
  const code = formatJobCode(job);
  return createNotification({
    userId: job.technician,
    jobId: job._id,
    type: NOTIFICATION_TYPE.JOB_UPDATED,
    message: `${code} "${job.title}" has been cancelled.`,
  });
}

/** Technician is informed when an admin edits job details or priority. */
export async function notifyJobUpdated(job, detail) {
  const code = formatJobCode(job);
  return createNotification({
    userId: job.technician,
    jobId: job._id,
    type: NOTIFICATION_TYPE.JOB_UPDATED,
    message: `${code} "${job.title}" was updated: ${detail}.`,
  });
}

/** Admin receives a system alert (e.g. technician-reported issue). */
export async function notifySystemAlert(userId, jobId, message) {
  return createNotification({
    userId,
    jobId,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message,
  });
}

/** Admin is confirmed when a new client is added to the system. */
export async function notifyClientCreated(adminUserId, client) {
  return createNotification({
    userId: adminUserId,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message: `New client added: ${client.name}${client.email ? ` (${client.email})` : ''}.`,
  });
}

/** Admin is confirmed when a new technician is added to the system. */
export async function notifyTechnicianCreated(adminUserId, technician) {
  return createNotification({
    userId: adminUserId,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message: `New technician added: ${technician.name}${technician.email ? ` (${technician.email})` : ''}.`,
  });
}

/** Admin is confirmed when a client's details are edited. */
export async function notifyClientUpdated(adminUserId, client) {
  return createNotification({
    userId: adminUserId,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message: `Client updated: ${client.name}.`,
  });
}

/** Admin is confirmed when a client is removed from the system. */
export async function notifyClientDeleted(adminUserId, client) {
  return createNotification({
    userId: adminUserId,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message: `Client deleted: ${client.name}.`,
  });
}

/** Admin is confirmed when a technician is deactivated. */
export async function notifyTechnicianDeactivated(adminUserId, technician) {
  return createNotification({
    userId: adminUserId,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message: `Technician deactivated: ${technician.name}.`,
  });
}

/** Admin is confirmed when a technician is reactivated. */
export async function notifyTechnicianReactivated(adminUserId, technician) {
  return createNotification({
    userId: adminUserId,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message: `Technician reactivated: ${technician.name}.`,
  });
}

/** Admin is confirmed when a technician is permanently removed. */
export async function notifyTechnicianDeleted(adminUserId, technician) {
  return createNotification({
    userId: adminUserId,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message: `Technician deleted: ${technician.name}.`,
  });
}

/** Admin (job creator) is notified when a technician submits a field report. */
export async function notifyReportSubmitted(job, technicianName) {
  const code = formatJobCode(job);
  return createNotification({
    userId: job.createdBy,
    jobId: job._id,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message: `${technicianName ?? 'Technician'} submitted a field report for ${code}.`,
  });
}

/** Admin is confirmed when a cancelled job is permanently deleted. */
export async function notifyJobDeleted(adminUserId, job) {
  const code = formatJobCode(job);
  return createNotification({
    userId: adminUserId,
    type: NOTIFICATION_TYPE.SYSTEM_ALERT,
    message: `${code} "${job.title}" was permanently deleted.`,
  });
}
