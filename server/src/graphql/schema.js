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
    CANCELLED
}

enum NotificationType{
    JOB_ASSIGNED
    JOB_UPDATED
    JOB_COMPLETED
    JOB_VERIFIED
    SYSTEM_ALERT
}

enum Priority {
    HIGH
    MEDIUM
    LOW
}

enum Category {
    NETWORKING
    ELECTRICAL
    HVAC
    PLUMBING
    OTHER
}

enum Availability {
    AVAILABLE
    UNAVAILABLE
}

enum ReportStatus {
    PENDING
    SUBMITTED
}

#=== TYPES ===

type User {
    id: ID!
    name: String! 
    email: String!
    role: Role!
    phone: String
    specialization: Category
    availability: Availability
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
    priority: Priority!
    category: Category!
    deadline: String!
    technician: User!
    client: User!
    createdBy: User!
    createdAt: String!
    updatedAt: String!
}

type Notification {
    id: ID!
    user: User!
    job: Job
    type: NotificationType!
    message: String!
    read: Boolean!
    delivered: Boolean!
    deliveredAt: String
    createdAt: String!
}

type DashboardStats {
    totalJobs: Int!
    activeTechnicians: Int!
    pendingJobs: Int!
    completedJobs: Int!
}

type Report {
    id: ID!
    job: Job!
    technician: User!
    notes: String
    status: ReportStatus!
    submittedAt: String
    createdAt: String!
    updatedAt: String!
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

    #Dashboard queries
    dashboardStats: DashboardStats!

    #Report queries
    myReports(status: ReportStatus): [Report!]!
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
    phone: String
    specialization: Category!
}

input CreateClientInput{
    name: String!
    email: String!
}

input CreateJobInput{
    title: String!
    description: String!
    location: String!
    priority: Priority
    category: Category!
    deadline: String!
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

    #Reports
    submitReport(jobId: ID!, notes: String!): Report!
}

`;

export default typeDefs;