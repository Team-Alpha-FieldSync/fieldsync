import User from "../../models/User.js";
import Job from "../../models/Job.js";
import { AVAILABILITY, ROLES, JOB_STATUS } from "../../utils/constants.js";
import { GraphQLError } from "graphql";
import { hashPassword } from "../../utils/hashPassword.js";
import { requireAdmin, requireAuth } from "../../guards/roles.js";
import { notifyClientCreated, notifyTechnicianCreated } from "../../services/notificationService.js";

export default{
    Query: {
        //Currently logged-in user
        me: async(_, __, {user}) => {
            requireAuth(user);
            return User.findById(user.userId);
        },

        //Generic user list, optionally filtered by role (admin only)
        users: async (_, {role}, {user}) => {
            requireAdmin(user);
            const filter = role ? {role: role.toLowerCase()} : {};
            return User.find(filter).sort({createdAt: -1});
        },

        //Shortcut: List all technicians (admin only). activeOnly limits to assignable techs.
        technicians: async (_, { activeOnly }, { user }) => {
            requireAdmin(user);
            const filter = { role: ROLES.TECHNICIAN };
            if (activeOnly) filter.isActive = { $ne: false };
            return User.find(filter).sort({ createdAt: -1 });
        },

        //Shortcut: list all clients (admin only)
        clients: async(_, __, {user}) => {
            requireAdmin(user);
            return User.find({role: ROLES.CLIENT}).sort({createdAt: -1});
        },
    },

    Mutation: {
        createTechnician: async (_, {input}, {user}) => {
            requireAdmin(user);

            const existing = await User.findOne({email: input.email.toLowerCase()});
            if(existing){
                throw new GraphQLError('A user with that email already exists', {
                    extensions: {code: 'BAD_USER_INPUT'},
                });
            }

            const technician = await User.create({
                ...input,
                password: await hashPassword(input.password),
                role: ROLES.TECHNICIAN,
                availability: AVAILABILITY.AVAILABLE,
                createdBy: user.userId,
            });
            await notifyTechnicianCreated(user.userId, technician);
            return technician;
        },

        deactivateTechnician: async (_, {id}, {user}) => {
            requireAdmin(user);
            const technician = await User.findById(id);
            if (!technician || technician.role !== ROLES.TECHNICIAN) {
                throw new GraphQLError("Invalid technician", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }

            const activeJobCount = await Job.countDocuments({
                technician: id,
                status: { $in: [JOB_STATUS.PENDING, JOB_STATUS.IN_PROGRESS] },
            });
            if (activeJobCount > 0) {
                throw new GraphQLError(
                    `Cannot deactivate: technician has ${activeJobCount} active job(s). Reassign or complete them first.`,
                    { extensions: { code: "BAD_USER_INPUT" } },
                );
            }

            technician.isActive = false;
            await technician.save();
            return technician;
        },

        createClient: async (_, { input }, { user }) => {
            requireAdmin(user);
        
            const existing = await User.findOne({ email: input.email.toLowerCase() });
            if (existing) {
                throw new GraphQLError('A user with that email already exists', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        
            //No password - Clients don't authenticate
            const client = await User.create({
                ...input,
                role: ROLES.CLIENT,
                createdBy: user.userId,
            });
            await notifyClientCreated(user.userId, client);
            return client;
        },

        updateClient: async (_, { id, input }, { user }) => {
            requireAdmin(user);

            const client = await User.findById(id);
            if (!client || client.role !== ROLES.CLIENT) {
                throw new GraphQLError("Invalid client", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }

            if (input.email != null) {
                const email = input.email.toLowerCase();
                const existing = await User.findOne({ email, _id: { $ne: id } });
                if (existing) {
                    throw new GraphQLError("A user with that email already exists", {
                        extensions: { code: "BAD_USER_INPUT" },
                    });
                }
                client.email = email;
            }
            if (input.name != null) client.name = input.name;
            if (input.phone != null) client.phone = input.phone;

            await client.save();
            return client;
        },

        deleteClient: async (_, { id }, { user }) => {
            requireAdmin(user);

            const client = await User.findById(id);
            if (!client || client.role !== ROLES.CLIENT) {
                throw new GraphQLError("Invalid client", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }

            const jobCount = await Job.countDocuments({ client: id });
            if (jobCount > 0) {
                throw new GraphQLError(
                    `Cannot delete: client has ${jobCount} associated job(s). Remove or reassign jobs first.`,
                    { extensions: { code: "BAD_USER_INPUT" } },
                );
            }

            await client.deleteOne();
            return client;
        },

    },

    //Resolver for the User.createdBy field
    //When the client asks for job.technician.createdBy.name, this fetches the parent admin
    User: {
        createdBy: async(parent) => {
            if(!parent.createdBy)return null;
            return User.findById(parent.createdBy);
        },
        techCode: (parent) => 
            parent.techNumber != null ? `TCH ${1000 + parent.techNumber}` : null,
        clientCode: (parent) =>
            parent.clientNumber != null ? `CLI ${1000 + parent.clientNumber}` : null,
        currentJob: async (parent) => {
            if(parent.role !== ROLES.TECHNICIAN) return null;
            return Job.findOne({
                technician: parent._id, 
                status: {$in: [JOB_STATUS.PENDING, JOB_STATUS.IN_PROGRESS]}
            }).sort({createdAt: -1});
        },
        createdAt: (parent) => parent.createdAt.toISOString() ?? null,
        updatedAt: (parent) => parent.updatedAt.toISOString() ?? null,
    },
};