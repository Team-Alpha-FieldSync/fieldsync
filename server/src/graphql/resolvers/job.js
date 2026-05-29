import { graphql, GraphQLError } from "graphql";
import Job from "../../models/Job.js";
import User from "../../models/User.js";
import { ROLES, JOB_STATUS } from "../../utils/constants.js";
import {
  requireAuth,
  requireAdmin,
  requireTechnician,
} from "../../guards/roles.js";
//Uncomment when notificationService exists
//import {notify} from '../../services/notificationService.js';

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
      if (!technician || technician.role !== ROLES.TECHNICIAN) {
        throw new GraphQLError("Invalid technician", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

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

      //TODO (notification ticket): trigger an "assigned" notification
      //await notify(client._id, job._id, 'assigned', '...');

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

      //Technicians can move pending -> in_progress -> completed
      //They cannot mark a job as verified - That is admin only
      const newStatus = status.toLowerCase();
      if (newStatus === JOB_STATUS.VERIFIED) {
        throw new GraphQLError("Only an admin can verify a job", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      job.status = newStatus;
      await job.save();

      //TODO (notification ticket): trigger a status_changed notification

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

      return job;
    },
  },

  //Field resolvers - turn ObjectId references into full User documents
  Job: {
    technician: async (parent) => User.findById(parent.technician),
    client: async (parent) => User.findById(parent.client),
    createdBy: async (parent) => User.findById(parent.createdBy),
  },
};
