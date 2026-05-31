import { GraphQLError } from "graphql";
import Report from "../../models/Report.js";
import Job from "../../models/Job.js";
import User from "../../models/User.js";
import { REPORT_STATUS } from "../../utils/constants.js";
import { requireTechnician } from "../../guards/roles.js";

export default {
  Query: {
    //Reports belonging to the current technician (optionally by status)
    myReports: async (_, { status }, { user }) => {
      requireTechnician(user);

      const filter = { technician: user.userId };
      if (status) filter.status = status; //enum already mapped to db value
      return Report.find(filter).sort({ createdAt: -1 });
    },
  },

  Mutation: {
    //A technician files (or updates) the field report for one of their jobs
    submitReport: async (_, { jobId, notes }, { user }) => {
      requireTechnician(user);

      const job = await Job.findById(jobId);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (job.technician.toString() !== user.userId) {
        throw new GraphQLError("You can only report on your own jobs", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      //Reuse the pending report created when the job was completed, if any
      let report = await Report.findOne({
        job: jobId,
        technician: user.userId,
      });
      if (!report) {
        report = new Report({ job: jobId, technician: user.userId });
      }

      report.notes = notes;
      report.status = REPORT_STATUS.SUBMITTED;
      report.submittedAt = new Date();
      await report.save();

      return report;
    },
  },

  //Field resolvers - turn ObjectId references into full documents
  Report: {
    job: async (parent) => Job.findById(parent.job),
    technician: async (parent) => User.findById(parent.technician),
  },
};
