const typeDefs = `#graphql
#=== ENUMS ===

enum Role{
    ADMIN
    TECHNICIAN
    CLIENT
}

enum JobStatus{
    PENDING
    IN_PROGRESS
    COMPLETED
    VERIFIED
}

enum NotificationType{
    ASSIGNED
    STATUS_CHANGED
    COMPLETED
}

#=== TYPES ===

type User {
    id: ID!
    name: String! 
    email: String!
    role: Role!
    createdBy: User
    createdAt: String!
    updatedAt: String!
}

type Job{
    id: ID!
    title: String!
    description: String!
    location: String!
    status: JobStatus!
    technician: User!
    client: User!
    createdBy: User!
    createdAt: String!
    updatedAt: String!
}

type Notification {
    id: ID!
    user: User!
    job: Job!
    type: NotificationType!
    message: String!
    read: Boolean!
    delivered: Boolean!
    deliveredAt: String
    createdAt: String!
}

#=== QUERIES ===

type Query{
    # Current logged-in user
    me: User

    #User queries(Admin only)
    users(role: Role): [User!]!
    technicians: [User!]!
    clients: [User!]!

    #Job queries
    jobs(status: JobStatus): [Job!]!
    job(id: ID!): Job
    myJobs: [Job!]!

    #Notification queries
    myNotifications(unreadOnly: Boolean): [Notification!]!
}

#=== MUTATIONS ===
type AuthPayload{
    token: String!
    user: User!
}

input CreateTechnicianInput{
    name: String!
    email: String!
    password: String!
}

input CreateClientInput{
    name: String!
    email: String!
}

input CreateJobInput{
    title: String!
    description: String!
    location: String!
    technicianId: ID!
    clientId: ID!
}

type Mutation {
    #Auth
    login(email: String!, password: String!): AuthPayload!

    #User management (admin only)
    createTechnician(input: CreateTechnicianInput!): User!
    createClient(input: CreateClientInput!): User!

    #Job management
    createJob(input: CreateJobInput!): Job!
    updateJobStatus(id: ID!, status: JobStatus!): Job!
    verifyJob(id: ID!): Job!

    #Notification
    markNotificationRead(id: ID!): Notification!
}

`;

export default typeDefs;