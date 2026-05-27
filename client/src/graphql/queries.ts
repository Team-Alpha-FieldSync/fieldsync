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
    createdAt
    updatedAt
    technician {
      id
      name
      email
    }
    client {
      id
      name
      email
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
