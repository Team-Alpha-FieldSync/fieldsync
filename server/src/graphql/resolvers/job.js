import { GraphQLError } from "graphql";
import Job from "../../models/Job.js";
import User from "../../models/User.js";
import Report from "../../models/Report.js";
import { ROLES, JOB_STATUS, REPORT_STATUS } from "../../utils/constants.js";
import { syncTechnicianAvailability } from "../../utils/syncTechnicianAvailability.js";
import {
  requireAuth,
  requireAdmin,
  requireTechnician,
} from "../../guards/roles.js";
import {
  notifyJobAssigned,
  notifyJobReassignedAway,
  notifyJobStatusChanged,
  notifyJobCompleted,
  notifyJobVerified,
  notifyJobCancelled,
  notifyJobUpdated,
} from "../../services/notificationService.js";

const TECHNICIAN_STATUS_TRANSITIONS = {
  [JOB_STATUS.PENDING]: [JOB_STATUS.IN_PROGRESS],
  [JOB_STATUS.IN_PROGRESS]: [JOB_STATUS.COMPLETED],
};

function assertAssignableTechnician(technician) {
  if (!technician || technician.role !== ROLES.TECHNICIAN) {
    throw new GraphQLError("Invalid technician", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  if (technician.isActive === false) {
    throw new GraphQLError("Cannot assign jobs to a deactivated technician", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
}

export default {
  Query: {
    //All jobs (admin only)
    jobs: async (_, { status }, { user }) => {
      requireAdmin(user);
      const filter = status ? { status: status.toLowerCase() } : {};
      return Job.find(filter).sort({ createdAt: -1 });
    },

    //Single job - admin can see any
    //Technician can only see their jobs
    job: async (_, { id }, { user }) => {
      requireAuth(user);

      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (
        user.role === ROLES.TECHNICIAN &&
        job.technician.toString() !== user.userId
      ) {
        throw new GraphQLError("You can only view your own jobs", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      return job;
    },

    //Jobs assigned to the current technician
    myJobs: async (_, __, { user }) => {
      requireTechnician(user);
      return Job.find({ technician: user.userId }).sort({ createdAt: -1 });
    },
  },

  Mutation: {
    createJob: async (_, { input }, { user }) => {
      requireAdmin(user);
      //Github Comment Fix
      if (input.technicianId === input.clientId) {
        throw new GraphQLError(
          "Technician and client cannot be the same user",
          {
            extensions: { code: "BAD_USER_INPUT" },
          },
        );
      }

      //Verify the technician and client exist with the right roles
      const technician = await User.findById(input.technicianId);
      assertAssignableTechnician(technician);

      const client = await User.findById(input.clientId);
      if (!client || client.role !== ROLES.CLIENT) {
        throw new GraphQLError("Invalid client", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const job = await Job.create({
        title: input.title,
        description: input.description,
        location: input.location,
        priority: input.priority,
        category: input.category,
        deadline: input.deadline,
        technician: input.technicianId,
        client: input.clientId,
        createdBy: user.userId,
        status: JOB_STATUS.PENDING,
      });

      await syncTechnicianAvailability(input.technicianId);
      await notifyJobAssigned(job);

      return job;
    },

    updateJob: async (_, { id, input }, { user }) => {
      requireAdmin(user);
      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if(job.status !== JOB_STATUS.PENDING) {
        throw new GraphQLError("Only pending jobs can be updated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      if(input.title != null) job.title = input.title;
      if(input.description != null) job.description = input.description;
      if(input.location != null) job.location = input.location;
      if(input.category != null) job.category = input.category;
      if(input.deadline != null) job.deadline = input.deadline;
      await job.save();
      await notifyJobUpdated(job, "details were edited");
      return job;
    },

    changeJobPriority: async (_, { id, priority }, { user }) => {
      requireAdmin(user);
      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if(![JOB_STATUS.PENDING, JOB_STATUS.IN_PROGRESS].includes(job.status)) {
        throw new GraphQLError("Priority can only change while pending or in progress", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      job.priority = priority;
      await job.save();
      await notifyJobUpdated(job, `priority set to ${priority}`);
      return job;
    },

    reassignJob: async (_, { id, technicianId }, { user }) => {
      requireAdmin(user);
      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if(job.status !== JOB_STATUS.PENDING) {
        throw new GraphQLError("Only pending jobs can be reassigned", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const technician = await User.findById(technicianId);
      assertAssignableTechnician(technician);
      const previousTechnicianId = job.technician?.toString();
      job.technician = technicianId;
      await job.save();
      await syncTechnicianAvailability(previousTechnicianId);
      await syncTechnicianAvailability(technicianId);
      await notifyJobReassignedAway(job, previousTechnicianId);
      await notifyJobAssigned(job);
      return job;
    },

    cancelJob: async (_, { id }, { user }) => {
      requireAdmin(user);
      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if(![JOB_STATUS.PENDING, JOB_STATUS.IN_PROGRESS].includes(job.status)) {
        throw new GraphQLError("Only pending or in progress jobs can be cancelled", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const technicianId = job.technician?.toString();
      job.status = JOB_STATUS.CANCELLED;
      await job.save();
      await syncTechnicianAvailability(technicianId);
      await notifyJobCancelled(job);
      return job;
    },

    deleteJob: async (_, { id }, { user }) => {
      requireAdmin(user);
      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if(job.status !== JOB_STATUS.CANCELLED) {
        throw new GraphQLError("Only cancelled jobs can be deleted", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      await job.deleteOne();
      return job;
    },

    updateJobStatus: async (_, { id, status }, { user }) => {
      requireAuth(user);

      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      //Only the assigned technician can update status
      //(Admins use verifyJob)
      if (
        user.role !== ROLES.TECHNICIAN ||
        job.technician.toString() !== user.userId
      ) {
        throw new GraphQLError(
          "Only the assigned technician can update this job",
          {
            extensions: { code: "FORBIDDEN" },
          },
        );
      }

      //Technicians can only move pending -> in_progress -> completed
      const newStatus = status.toLowerCase();
      if (newStatus === JOB_STATUS.VERIFIED) {
        throw new GraphQLError("Only an admin can verify a job", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const allowedNext = TECHNICIAN_STATUS_TRANSITIONS[job.status];
      if (!allowedNext || !allowedNext.includes(newStatus)) {
        throw new GraphQLError(
          `Invalid status transition from ${job.status} to ${newStatus}`,
          { extensions: { code: "BAD_USER_INPUT" } },
        );
      }

      job.status = newStatus;
      await job.save();

      const technician = await User.findById(user.userId);

      if (newStatus === JOB_STATUS.IN_PROGRESS) {
        await notifyJobStatusChanged(
          job,
          JOB_STATUS.IN_PROGRESS,
          technician?.name,
        );
      }

      //When a job is completed, open a pending field report for the technician
      //(so it surfaces under "Pending Reports" until they submit it)
      if (newStatus === JOB_STATUS.COMPLETED) {
        const existing = await Report.findOne({
          job: job._id,
          technician: user.userId,
        });
        if (!existing) {
          await Report.create({
            job: job._id,
            technician: user.userId,
            status: REPORT_STATUS.PENDING,
          });
        }
        await syncTechnicianAvailability(job.technician);
        await notifyJobCompleted(job, technician?.name);
      }

      return job;
    },

    verifyJob: async (_, { id }, { user }) => {
      requireAdmin(user);

      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (job.status !== JOB_STATUS.COMPLETED) {
        throw new GraphQLError("Only completed jobs can be verified", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      job.status = JOB_STATUS.VERIFIED;
      await job.save();
      await notifyJobVerified(job);

      return job;
    },
  },

  //Field resolvers - turn ObjectId references into full User documents
  Job: {
    technician: async (parent) => User.findById(parent.technician),
    client: async (parent) => User.findById(parent.client),
    createdBy: async (parent) => User.findById(parent.createdBy),
    code: (parent) =>
      parent.jobNumber != null
        ? `JOB-${parent.jobNumber}`
        : `JOB-${parent._id.toString().slice(-6)}`,
    createdAt: (parent) => parent.createdAt.toISOString() ?? null,
    updatedAt: (parent) => parent.updatedAt.toISOString() ?? null,
    deadline: (parent) => parent.deadline.toISOString() ?? null,
  },
};
