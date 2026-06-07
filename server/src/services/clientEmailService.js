import User from '../models/User.js';
import { ROLES } from '../utils/constants.js';
import { sendEmail } from './emailService.js';
import { formatJobCode } from './notificationService.js';

const fallback = 'Not available';

function formatDateTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat('en-GH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Accra',
  }).format(date);
}

function supportContact() {
  const parts = [process.env.SUPPORT_PHONE, process.env.SUPPORT_EMAIL]
    .map((part) => part?.trim())
    .filter(Boolean);

  return parts.join(' / ');
}

async function sendClientEmail(client, templateName, data) {
  if (!client?.email) return false;

  try {
    const sent = await sendEmail(client.email, templateName, data);
    if (!sent) {
      console.warn(`Client email was not sent to ${client.email} using template ${templateName}`);
    }
    return sent;
  } catch (err) {
    console.error(`Client email failed for ${client.email}:`, err.message);
    return false;
  }
}

async function withClientEmailFailureLogging(action, description) {
  try {
    return await action();
  } catch (err) {
    console.error(`Client email flow failed for ${description}:`, err.message);
    return false;
  }
}

async function getClient(clientId) {
  if (!clientId) return null;

  const client = await User.findById(clientId);
  return client?.role === ROLES.CLIENT ? client : null;
}

async function getTechnician(technicianId) {
  if (!technicianId) return null;

  const technician = await User.findById(technicianId);
  return technician?.role === ROLES.TECHNICIAN ? technician : null;
}

function jobEmailData(job, client, technician, eventTime = new Date()) {
  return {
    clientName: client?.name ?? 'there',
    jobCode: formatJobCode(job),
    jobTitle: job.title,
    jobLocation: job.location,
    technicianName: technician?.name ?? 'your assigned technician',
    assignedAt: formatDateTime(eventTime),
    startedAt: formatDateTime(eventTime),
    completedAt: formatDateTime(eventTime),
    verifiedAt: formatDateTime(eventTime),
    deadline: formatDateTime(job.deadline),
  };
}

export async function emailClientCreated(client) {
  return withClientEmailFailureLogging(
    () => sendClientEmail(client, 'client_created', {
      clientName: client.name,
    }),
    'client creation',
  );
}

export async function emailClientDeleted(client) {
  return withClientEmailFailureLogging(
    () => sendClientEmail(client, 'client_deleted', {
      clientName: client.name,
    }),
    'client deletion',
  );
}

export async function emailClientJobAssigned(job, eventTime = new Date()) {
  return withClientEmailFailureLogging(async () => {
    const [client, technician] = await Promise.all([
      getClient(job.client),
      getTechnician(job.technician),
    ]);

    return sendClientEmail(client, 'client_job_assigned', jobEmailData(job, client, technician, eventTime));
  }, 'job assignment');
}

export async function emailClientJobReassigned(job, eventTime = new Date()) {
  return withClientEmailFailureLogging(async () => {
    const [client, technician] = await Promise.all([
      getClient(job.client),
      getTechnician(job.technician),
    ]);

    return sendClientEmail(client, 'client_job_reassigned', jobEmailData(job, client, technician, eventTime));
  }, 'job reassignment');
}

export async function emailClientJobStarted(job, eventTime = new Date()) {
  return withClientEmailFailureLogging(async () => {
    const [client, technician] = await Promise.all([
      getClient(job.client),
      getTechnician(job.technician),
    ]);

    return sendClientEmail(client, 'client_job_started', jobEmailData(job, client, technician, eventTime));
  }, 'job start');
}

export async function emailClientJobCompleted(job, eventTime = new Date()) {
  return withClientEmailFailureLogging(async () => {
    const [client, technician] = await Promise.all([
      getClient(job.client),
      getTechnician(job.technician),
    ]);

    return sendClientEmail(client, 'client_job_completed', jobEmailData(job, client, technician, eventTime));
  }, 'job completion');
}

export async function emailClientJobVerified(job, eventTime = new Date()) {
  return withClientEmailFailureLogging(async () => {
    const client = await getClient(job.client);

    return sendClientEmail(client, 'client_job_verified', jobEmailData(job, client, null, eventTime));
  }, 'job verification');
}

export async function emailClientJobCancelled(job) {
  return withClientEmailFailureLogging(async () => {
    const client = await getClient(job.client);

    return sendClientEmail(client, 'client_job_cancelled', {
      ...jobEmailData(job, client),
      supportContact: supportContact(),
    });
  }, 'job cancellation');
}

export async function emailClientJobUpdated(job, updateSummary) {
  return withClientEmailFailureLogging(async () => {
    const client = await getClient(job.client);

    return sendClientEmail(client, 'client_job_updated', {
      ...jobEmailData(job, client),
      updateSummary,
    });
  }, 'job update');
}
