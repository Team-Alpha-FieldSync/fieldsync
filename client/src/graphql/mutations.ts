import { gql } from "@apollo/client";

// --- Auth ---

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

// --- User management ---

export const CREATE_TECHNICIAN_MUTATION = gql`
  mutation CreateTechnician($input: CreateTechnicianInput!) {
    createTechnician(input: $input) {
      id
      name
      email
      role
      createdAt
    }
  }
`;

export const CREATE_CLIENT_MUTATION = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      name
      email
      role
      createdAt
    }
  }
`;

// --- Job management ---

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      id
      title
      description
      location
      status
      createdAt
      technician {
        id
        name
      }
      client {
        id
        name
      }
    }
  }
`;

export const UPDATE_JOB_STATUS_MUTATION = gql`
  mutation UpdateJobStatus($id: ID!, $status: JobStatus!) {
    updateJobStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const VERIFY_JOB_MUTATION = gql`
  mutation VerifyJob($id: ID!) {
    verifyJob(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

// --- Notifications ---

export const MARK_NOTIFICATION_READ_MUTATION = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      read
    }
  }
`;
