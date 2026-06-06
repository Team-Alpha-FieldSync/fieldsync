import Job from '../../models/Job.js';
import User from '../../models/User.js';
import { ROLES, JOB_STATUS, AVAILABILITY } from '../../utils/constants.js';
import { requireAdmin } from '../../guards/roles.js';

export default {
  Query: {
    dashboardStats: async (_, __, { user }) => {
      requireAdmin(user);

      const [totalJobs, pendingJobs, completedJobs, activeTechnicians] =
        await Promise.all([
          Job.countDocuments({}),
          Job.countDocuments({ status: JOB_STATUS.PENDING }),
          Job.countDocuments({ status: JOB_STATUS.COMPLETED }),
          User.countDocuments({
            role: ROLES.TECHNICIAN,
            availability: AVAILABILITY.AVAILABLE,
          }),
        ]);

      return { totalJobs, pendingJobs, completedJobs, activeTechnicians };
    },
  },
};