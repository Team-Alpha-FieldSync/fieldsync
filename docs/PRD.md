# FieldSync – Product Requirements Document (PRD)

## Project Title
**FieldSync – Field Operations Management Platform**

---

# 1. Project Overview

FieldSync is a web-based platform designed for **SwiftFix Facilities Management** to manage maintenance and repair operations across Accra.

The system replaces the company’s current workflow of WhatsApp communication and Excel spreadsheets with a centralized platform for managing jobs, technicians, and client updates.

## Core Features

The platform will allow:

- Admins to create and assign jobs
- Technicians to manage assigned tasks
- Clients to receive real-time job updates

---

# 2. Problem Statement

SwiftFix currently manages operations using WhatsApp groups and shared spreadsheets.

This has resulted in:

- Lost or ignored job assignments
- Poor technician activity tracking
- Lack of operational visibility
- Repeated client follow-ups
- Technicians arriving at incorrect locations

FieldSync aims to provide a centralized solution for job assignment, tracking, and communication.

---

# 3. Project Goals

The system should:

- Centralize maintenance job management
- Improve technician coordination
- Provide real-time job tracking
- Reduce communication delays
- Improve client visibility and updates
- Provide operational oversight for management

---

# 4. User Personas

## 4.1 Admin

### Description
Managers responsible for coordinating operations.

### Goals
- Create and assign jobs
- Monitor technician activity
- Track job progress
- Verify completed jobs

---

## 4.2 Technician

### Description
Field workers responsible for maintenance tasks.

### Goals
- View assigned jobs
- Access location and client details
- Update job statuses

---

## 4.3 Client

### Description
Customers requesting maintenance services.

### Goals
- Receive updates about job progress
- Know when jobs are assigned or completed

---

# 5. Functional Requirements

## F1 — Authentication & Role Management

### Requirements
- Support Admin, Technician, and Client roles
- JWT-based authentication
- Role-based access control

### Acceptance Criteria
- Users can log in securely
- Unauthorized access is blocked
- Users only access features relevant to their role

---

## F2 — Job Creation & Assignment

### Requirements

Admins should be able to:

- Create jobs
- Assign technicians
- Assign clients
- Add job title, description, and location

### Job Status Lifecycle

```text
Pending → In Progress → Completed → Verified
```

### Acceptance Criteria
- Jobs are saved successfully
- Assigned technicians can view assigned jobs
- Job statuses update correctly

---

## F3 — Technician Dashboard

### Requirements

Technicians should be able to:

- View assigned jobs
- View job details
- Update job status

### Acceptance Criteria
- Technicians only see assigned jobs
- Dashboard is mobile responsive
- Status updates reflect immediately

---

## F4 — Admin Dashboard

### Requirements

Admins should be able to:

- View all jobs
- Filter jobs by status
- Reassign technicians
- Verify completed jobs
- Monitor job summaries

### Acceptance Criteria
- Dashboard displays all jobs correctly
- Status filters function properly
- Reassigned jobs update successfully

---

## F5 — Client Notifications

### Requirements

Clients should receive notifications when:

- A job is assigned
- A job status changes
- A job is completed

### Acceptance Criteria
- Notifications are triggered automatically
- Correct clients receive updates

---

## F6 — GraphQL API

### Requirements
- All frontend-backend communication must use GraphQL
- Apollo Client will be used on the frontend
- REST endpoints will not be used for core operations

### Acceptance Criteria
- CRUD operations function through GraphQL
- Frontend communicates successfully with the backend

---

# 6. Non-Functional Requirements

## Performance
- Dashboard should load within 3 seconds

## Security
- Passwords must be hashed
- JWT authentication is required
- Role-based authorization must be enforced

## Responsiveness
- Technician dashboard must function properly on mobile devices

## Scalability
- System should support increasing users and job volume

---

# 7. User Stories

## Admin Stories
- As an admin, I want to create jobs so work can be assigned efficiently.
- As an admin, I want to assign technicians so responsibilities are clear.
- As an admin, I want to verify completed jobs so quality can be confirmed.

---

## Technician Stories
- As a technician, I want to view assigned jobs so I know what work to complete.
- As a technician, I want to update job statuses so management can track progress.

---

## Client Stories
- As a client, I want to receive notifications so I know the progress of my maintenance request.

---

# 8. System Architecture

```text
React Frontend
       ↓
Apollo Client
       ↓
GraphQL API
(Node.js + Express)
       ↓
MongoDB Database
```

---

# 9. Data Models

## User Model

| Field    | Type   |
|----------|--------|
| name     | String |
| email    | String |
| password | String |
| role     | String |

---

## Job Model

| Field       | Type      |
|-------------|-----------|
| title       | String    |
| description | String    |
| location    | String    |
| status      | String    |
| technician  | ObjectId  |
| client      | ObjectId  |
| createdAt   | Date      |

---

## Notification Model

| Field     | Type      |
|-----------|-----------|
| user      | ObjectId  |
| message   | String    |
| read      | Boolean   |
| createdAt | Date      |

---

# 10. Technology Stack

| Layer              | Technology        |
|-------------------|------------------|
| Frontend          | React            |
| Styling           | Tailwind CSS     |
| Backend           | Node.js + Express |
| API               | GraphQL          |
| GraphQL Client    | Apollo Client    |
| Database          | MongoDB          |
| ODM               | Mongoose         |
| Authentication    | JWT + bcryptjs   |

---

# 11. Stretch Goals

Optional features if core requirements are completed early:

- Photo upload for completed jobs
- Admin analytics dashboard
- Job history and audit log

---

# 12. Conclusion

FieldSync will provide SwiftFix Facilities Management with a centralized platform for managing field operations, improving communication, increasing accountability, and providing real-time visibility into maintenance activities.
