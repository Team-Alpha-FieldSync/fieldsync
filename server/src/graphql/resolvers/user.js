import User from "../../models/User.js";
import Job from "../../models/Job.js";
import { ROLES, JOB_STATUS } from "../../utils/constants.js";
import { AVAILABILITY, ROLES } from "../../utils/constants.js";
import { GraphQLError } from "graphql";
import { hashPassword } from "../../utils/hashPassword.js";
import { requireAdmin, requireAuth } from "../../guards/roles.js";

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

        //Shortcut: List all technicians (admin only)
        technicians: async (_, __, {user}) => {
            requireAdmin(user);
            return User.find({role: ROLES.TECHNICIAN}).sort({createdAt: -1});
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

            return User.create({
                ...input,
                password: await hashPassword(input.password),
                role: ROLES.TECHNICIAN,
                availability: AVAILABILITY.AVAILABLE,
                createdBy: user.userId,
            });
        },

        deactivateTechnician: async (_, {id}, {user}) => {
            requireAdmin(user);
            const technician = await User.findById(id);
            if (!technician || technician.role !== ROLES.TECHNICIAN) {
                throw new GraphQLError("Invalid technician", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
            technician.isActive = false;
            await technician.save();
            return technician;
        },

        createClient:async (_, {input}, {user}) => {
            requireAdmin(user);

            const existing = await User.findOne({email: input.email.toLowerCase()});
            if(existing){
                throw new GraphQLError('A user with that email already exists',{
                    extensions: {code: 'BAD_USER_INPUT'},
                });
            }

            //No password - Clients don't authenticate
            return User.create({
                ...input,
                role: ROLES.CLIENT,
                createdBy: user.userId,
            });
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