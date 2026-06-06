import { gql } from "@apollo/client";

// --- Auth ---

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
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
      phone
      specialization
      availability
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
      phone
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
      priority
      category
      deadline
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
      title
      description
      location
      category
      deadline
      status
      updatedAt
    }
  }
`;

export const CHANGE_JOB_PRIORITY_MUTATION = gql`
  mutation ChangeJobPriority($id: ID!, $priority: Priority!) {
    changeJobPriority(id: $id, priority: $priority) {
      id
      priority
      updatedAt
    }
  }
`;

export const REASSIGN_JOB_MUTATION = gql`
  mutation ReassignJob($id: ID!, $technicianId: ID!) {
    reassignJob(id: $id, technicianId: $technicianId) {
      id
      technician {
        id
        name
        techCode
      }
    }
  }
`;

export const CANCEL_JOB_MUTATION = gql`
  mutation CancelJob($id: ID!) {
    cancelJob(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const DELETE_JOB_MUTATION = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id) {
      id
    }
  }
`;

export const DEACTIVATE_TECHNICIAN_MUTATION = gql`
  mutation DeactivateTechnician($id: ID!) {
    deactivateTechnician(id: $id) {
      id
      isActive
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

//---------- Reports ----------
export const SUBMIT_REPORT_MUTATION = gql`
  mutation SubmitReport($jobId: ID!, $notes: String!) {
    submitReport(jobId: $jobId, notes: $notes) {
      id
      status
      notes
      submittedAt
    }
  }
`;

export const REPORT_ISSUE_MUTATION = gql`
  mutation ReportIssue($jobId: ID!, $message: String!) {
    reportIssue(jobId: $jobId, message: $message) {
      id
      message
      type
      read
      createdAt
    }
  }
`;