# ⚡ Workora — Task Menu System

> **Advanced Full-Stack Task & Infrastructure Management Pipeline with Zero-Trust Security Architecture**

---

<div align="center">

[![Website Launch](https://shields.io)](https://workora.cloud)
[![Backend Framework](https://shields.io)](https://fastapi.tiangolo.com/)
[![Frontend Matrix](https://shields.io)](https://nextjs.org/)
[![Database Persistence](https://shields.io)](https://www.mongodb.com/)
[![Container Infrastructure](https://shields.io)](https://www.docker.com/)

</div>

---

### 🔍 Architectural Overview

Task Menu, engineered under the corporate identity **Workora**, is a high-performance, full-stack task orchestration and telemetry application. Beyond standard CRUD utilities, this platform serves as a benchmark for layered software architecture, asynchronous non-blocking runtime execution, and enterprise-grade cryptographic barrier defense protocols.

By decoupling concerns across a **Next.js 22 (TypeScript) single-page frontend App Routing matrix**, a highly optimized **Python FastAPI server application**, and an isolated containerized **MongoDB persistent storage layer**, Workora delivers sub-millisecond operational velocity under production conditions.

---

### 📊 System Telemetry & Technology Stack

| Architecture Component | Technology Stack Core | Operational Role Parameters |
| :--- | :--- | :--- |
| **User Interface Layer** | `Next.js 22`, `React`, `TypeScript`, `Tailwind CSS` | Premium Glassmorphic UI with O(N) linear state filtering. |
| **Logic & Core Services** | `Python 3.12`, `FastAPI`, `Uvicorn Async Web Server` | High-throughput asynchronous routing and pipeline endpoints. |
| **Data Persistence Node** | `MongoDB 8.0 Cluster Standard` | Scalable BSON document mapping for fluid payload storage. |
| **Identity & Firewall** | `NextAuth`, `JWT Cryptography`, `Google reCAPTCHA v3` | Zero-Trust verification gates, OTP tokens, and tracking logs. |
| **Infrastructure Context** | `Docker`, `Docker Compose V2 Engine` | Isolated bridged networking containers with automated health checks. |
| **Secure Pipeline Gate** | `Cloudflare Tunnel (cloudflared)` | Egress-only network mapping to suppress public IP boundary leaks. |

---
## 📐 Structural Engineering Architecture

The backend implements a highly strict, decoupled multi-layered pattern ensuring unidirectional dependency resolution and absolute isolation of operational components.

```text
       [ Public Client User Interface ]  --->  (Next.js WebApp Hub)
                                                    | (OAuth 2.0 / NextAuth)
                                                    v
       [ Inbound Cloudflare Tunnel ]     --->  (Token Gate Inspection)
                                                    | (reCAPTCHA Verification)
                                                    v
       [ FastAPI Route Handlers ]        --->  (Input Schema Parsing via Pydantic)
                                                    |
                                                    v
       [ Cryptographic Security Layer ]  --->  (Rate-Limiter & Active Attempt Tracer)
                                                    |
                                                    v
       [ Business Logic Services ]       --->  (Pipeline Management & Validation)
                                                    |
                                                    v
       [ Data Encapsulation Repos ]      --->  (MongoDB Query Execution Node)
```

### 🛠️ Core Functional Sub-Systems

#### 1. Pipeline Telemetry (Task & Project Clustering)
* **Isolated Containers:** Workspaces are segmented into distinct Pipeline Clusters with individual encryption scopes.
* **Velocity Tracking:** Tasks are organized using low-overhead asynchronous counters mapping operational progression through strict state machines (`todo`, `in_progress`, `done`).
* **Risk Evaluation:** Dynamic operational task assignment utilizing prioritized threat metrics (`low`, `medium`, `high`).

#### 2. Perimeter Security Framework (Zero-Trust Security Design)
* **Cryptographic Tokens:** Implements asymmetric JSON Web Tokens (JWT) using a short-lived `AccessToken` (15-minute lifecycle tracking) combined with a highly fortified persistent `RefreshToken` (30-day lifecycle) with rolling automatic rotation capabilities.
* **Verification Gates:** Outbound registration sequences trigger mandatory multi-channel One-Time Password (OTP) verification tokens with a 60-second hardware cooldown countdown.
* **Firewall Sandbox Tracking:** Real-time logging of failed authentication signatures. The system calculates threat velocity, triggering automatic temporary user/device locking (`Access Denied Firewall`) when thresholds are breached.

---
## 🚀 Production Deployment & Installation

### Prerequisites & Node Environments
Ensure the host engine contains the following compiled utilities:
* `Git Client Core` (Standard configuration)
* `Docker Engine V24+` & `Docker Compose V2+`

### 1. Replicate Dynamic Environment Repository
```bash
git clone https://github.com/ashrafabusunaina1986/task-menu.git
cd task-menu
```

### 2. Configure Production Key Environments
Initialize a clean `.env` file in the root context.

```bash
# Core Public Routing Parameters
API_URL_SERVER=http://backend-app:8000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_google_recaptcha_site_key

# Database Cryptographic Identifiers
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=your_highly_encrypted_secure_password

# External Access Nodes Tokens
CLOUDFLARED_TOKEN=your_cloudflare_tunnel_ingress_access_token
```
*⚠️ **Security Enforcement:** Never commit production `.env` files, passwords, or raw cryptographic signature credentials to public open-source Git trackers.*

### 3. Initialize Container Cluster Infrastructure
Compile and launch the container networks in background decoupled execution mode:
```bash
docker compose up --build -d
```

### 4. Monitor Infrastructure Node Health
Verify active runtime parameters and health checks of the internal bridged networks:
```bash
# Audit container status loops
docker compose ps

# Trace production execution logs حياً
docker compose logs -f
```

To collapse the active cloud infrastructure and safely unmount the persistence volumes:
```bash
docker compose down
```

---

## 👨‍💻 System Architect

**Ashraf Abusunaineh**
* Full-Stack Cyber-Security & Software Engineer

* **Active GitHub Repository:** [@ashrafabusunaina1986](https://github.com/ashrafabusunaina1986)
* **Operational Cloud Workspace Website:** [workora.cloud](https://workora.cloud)

---
*Task Menu — Workora is an evolutionary computing architecture constantly optimized for full-stack software reliability, clean layered layout definitions, and zero-trust perimeter network security implementations.*
