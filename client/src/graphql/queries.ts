import { gql } from "@apollo/client";

// --- User ---

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
  }
`;

export const USERS_QUERY = gql`
  query Users($role: Role) {
    users(role: $role) {
      id
      name
      email
      role
      createdAt
    }
  }
`;

export const TECHNICIANS_QUERY = gql`
  query Technicians {
    technicians {
      id
      name
      email
      phone
      specialization
      availability
      role
      createdAt
    }
  }
`;

export const CLIENTS_QUERY = gql`
  query Clients {
    clients {
      id
      name
      email
      role
      createdAt
    }
  }
`;

// --- Jobs ---

const JOB_FIELDS = gql`
  fragment JobFields on Job {
    id
    title
    description
    location
    status
    priority
    category
    deadline
    createdAt
    updatedAt
    technician {
      id
      name
      email
      phone
      specialization
      availability
    }
    client {
      id
      name
      email
      phone
    }
  }
`;

export const JOBS_QUERY = gql`
  ${JOB_FIELDS}
  query Jobs($status: JobStatus) {
    jobs(status: $status) {
      ...JobFields
    }
  }
`;

export const JOB_QUERY = gql`
  ${JOB_FIELDS}
  query Job($id: ID!) {
    job(id: $id) {
      ...JobFields
    }
  }
`;

export const MY_JOBS_QUERY = gql`
  ${JOB_FIELDS}
  query MyJobs {
    myJobs {
      ...JobFields
    }
  }
`;

// --- Dashboard / Notifications ---
export const DASHBOARD_STATS_QUERY = gql`
  query DashboardStats {
    dashboardStats {
      totalJobs
      activeTechnicians
      pendingJobs
      completedJobs
    }
  }
`;

export const MY_NOTIFICATIONS_QUERY = gql`
  query MyNotifications($unreadOnly: Boolean) {
    myNotifications(unreadOnly: $unreadOnly) {
      id
      type
      message
      read
      delivered
      createdAt
      job {
        id
        title
        status
      }
    }
  }
`;
