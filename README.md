# Task Menu — Workora

**A Full-Stack Task Management Application with Authentication and Security**

[![Website](https://img.shields.io/badge/Website-Workora-blue)](https://workora.cloud)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248)](https://www.mongodb.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Docker-2496ED)](https://www.docker.com/)

## Overview

Task Menu, also known as **Workora**, is a full-stack task management application designed to organize tasks while providing a foundation for secure user authentication, authorization, and backend security controls.

The project combines a Next.js frontend, a FastAPI backend, and MongoDB for data persistence. Docker Compose is used to manage the application's services and deployment environment.

Beyond basic task management, the project focuses on software architecture, separation of responsibilities, and the implementation of security mechanisms that can support future development.

## Key Features

- **Task Management:** Organize tasks by status and priority.
- **User Authentication:** Support user sign-in and registration workflows.
- **Email OTP Verification:** Verify authentication and registration requests using one-time passwords.
- **Authorization:** Apply role-based access rules to protected resources.
- **JWT-Based Security:** Use access and refresh tokens in the authentication architecture.
- **Security Attempt Tracking:** Record authentication-related attempts and apply configurable limits.
- **User Blocking:** Support security controls for users or contexts that exceed permitted attempt limits.
- **MongoDB Integration:** Persist application data using MongoDB collections.
- **Containerized Deployment:** Run the application services using Docker Compose.
- **Production Deployment:** The project website is available at [workora.cloud](https://workora.cloud).

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Python, FastAPI |
| Database | MongoDB |
| Authentication | JWT, OTP, NextAuth |
| Infrastructure | Docker, Docker Compose |
| Deployment | Cloudflare Tunnel |

## Architecture

The backend follows a layered architecture that separates data access, business logic, security responsibilities, and HTTP endpoints.

```text
Client
  |
  v
Next.js Frontend
  |
  v
FastAPI Routes
  |
  v
Security Layer
  |
  v
Services
  |
  v
Repositories
  |
  v
MongoDB
```

### Backend Layers

- **Routes:** Receive HTTP requests, validate inputs, and return responses.
- **Security:** Handle authentication dependencies, token validation, authorization policies, and access control.
- **Services:** Implement application business logic and coordinate operations.
- **Repositories:** Encapsulate database queries and persistence operations.
- **Database:** Store users, tasks, sessions, OTP records, and security-related data.

The objective of this design is to keep each component focused on a specific responsibility, making the codebase easier to understand, test, maintain, and extend.

## Security Design

Security is a central part of the project rather than an isolated feature.

The application includes work on the following areas:

- Authentication and identity verification.
- Authorization and protected endpoints.
- Access-token and refresh-token handling.
- OTP verification workflows.
- Tracking failed authentication attempts.
- Attempt limits and temporary blocking mechanisms.
- Session management.
- Separation of security policies from route handlers and database operations.

These mechanisms provide a foundation for further security improvements and future security-intelligence capabilities.

## Task Organization

Tasks use a status model with the following values:

- `todo` — Task has not started.
- `in_progress` — Task is being worked on.
- `done` — Task is completed.

The task model also supports priority levels:

- `low`
- `medium`
- `high`

## Running the Project

### Prerequisites

Install the following tools:

- Git
- Docker
- Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/ashrafabusunaina1986/task-menu.git
cd task-menu
```

### 2. Configure environment variables

Review the project's environment configuration and create the required environment files.

Configure the necessary database connection settings, authentication secrets, frontend settings, and other required variables.

**Never commit real passwords, API keys, JWT secrets, or production environment files to Git.**

### 3. Start the application

If the repository contains the required Docker Compose configuration, build and start the services with:

```bash
docker compose up --build -d
```

### 4. Check service status

```bash
docker compose ps
```

To inspect service logs:

```bash
docker compose logs -f
```

Stop the services with:

```bash
docker compose down
```

Refer to the project's configuration files for the actual ports, environment variables, and service-specific setup.

## Project Goals

Task Menu is both a task management application and a practical software engineering project.

Its goals include:

1. Building a maintainable full-stack application.
2. Applying clear backend layering and separation of concerns.
3. Implementing authentication and authorization mechanisms.
4. Improving application security through attempt tracking and access controls.
5. Using containerization to simplify deployment and service management.
6. Establishing a foundation for future security analytics and intelligence systems.

## Future Development

Potential future improvements include:

- More comprehensive automated testing.
- Expanded security auditing and event logging.
- Improved monitoring and operational visibility.
- Additional security analytics.
- Integration with future Security Brain Model (SBM) research and development.

## Author

**Ashraf Abusunaineh**

GitHub: [@ashrafabusunaina1986](https://github.com/ashrafabusunaina1986)

Project: [Task Menu — Workora](https://github.com/ashrafabusunaina1986/task-menu)

Website: [workora.cloud](https://workora.cloud)

---

*Task Menu is an evolving project focused on full-stack development, software architecture, and application security.*
