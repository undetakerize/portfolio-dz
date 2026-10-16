# Adi Hadiansyah — Portfolio & Production Playground

Personal portfolio and production engineering playground for **Adi Hadiansyah** (Backend Engineer). Built with Vue 3 and Spring Boot 3, containerized with Docker Compose, and deployed on an Ubuntu 24.04 LTS VPS (2 GB RAM).

🌐 **Live Website:** [adihadiansyah.site](https://adihadiansyah.site)

---

## 🏛️ System Architecture

Traffic flows through host Nginx for SSL termination, serving the static frontend directly and proxying API calls to the containerized backend over a loopback interface.

```text
                     Internet / Client Request
                                 │
                                 │ HTTPS (Port 443) / HTTP (Port 80 -> 301)
                                 ▼
                     ┌───────────────────────┐
                     │  Host Nginx (Ubuntu)  │
                     │  Let's Encrypt TLS    │
                     └───────────┬───────────┘
                                 │
        ┌────────────────────────┴────────────────────────┐
        │                                                 │
        ▼ (Static Assets / SPA)                           ▼ (/api/* Reverse Proxy)
┌──────────────────────────────┐              ┌──────────────────────────────┐
│  /var/www/diezaster/current  │              │    127.0.0.1:8080 (Host)     │
│  (Atomic Symlink Deployment) │              └──────────────┬───────────────┘
│  Vue 3 + Vite Bundle         │                             │
└──────────────────────────────┘                             ▼
                                              ┌──────────────────────────────┐
                                              │ Docker Network: internal-net │
                                              │                              │
                                              │  ┌────────────────────────┐  │
                                              │  │ diezaster-backend      │  │
                                              │  │ Temurin 17 JRE Alpine  │  │
                                              │  │ Spring Boot 3 (CQRS)   │  │
                                              │  │ Non-root user (spring) │  │
                                              │  │ Limit: 384MB RAM       │  │
                                              │  └───────────┬────────────┘  │
                                              │              │               │
                                              │              │ JDBC (5432)   │
                                              │              ▼               │
                                              │  ┌────────────────────────┐  │
                                              │  │ diezaster-postgres     │  │
                                              │  │ PostgreSQL 16 Alpine   │  │
                                              │  │ Volume: pgdata         │  │
                                              │  │ Limit: 256MB RAM       │  │
                                              │  └────────────────────────┘  │
                                              └──────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Domain | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | Vue 3 (Composition API) | Single Page Application built with Vite |
| **Typography** | Geist Sans & Geist Mono | Self-hosted via `@fontsource-variable/geist` & `geist-mono` |
| **Frontend Testing** | Happy-DOM | Lightweight DOM simulation and SSR/interaction checks |
| **Backend Framework** | Spring Boot 3.4 (Java 17) | Pragmatic CQRS (Command for inquiries, Query for audit logs) |
| **Runtime Container** | Eclipse Temurin 17 JRE | Alpine base, multi-stage Maven build, unprivileged `spring` user |
| **Database** | PostgreSQL 16 | Containerized (`postgres:16-alpine`) with persistent volume |
| **Connection Pool** | HikariCP | Capped at 5 maximum connections for low resource usage |
| **Reverse Proxy** | Nginx (Host) | Handles Let's Encrypt TLS and routes `/api/` traffic |
| **Orchestration** | Docker Compose | Bridge network isolation, healthchecks, strict memory limits |
| **Host OS** | Ubuntu 24.04 LTS | Cost-efficient 2 GB RAM cloud VPS |

---

## 💾 VPS Constraints & Memory Tuning

The application runs on a modest **2 GB RAM** VPS that hosts the operating system, Nginx, Docker daemon, backend service, and database. Left unconstrained, JVM heap growth and database buffer pools can trigger Linux Out-Of-Memory (OOM) killer events.

### Resource Allocation Strategy

| Component | RAM Allocation | Configuration / Rationale |
| :--- | :--- | :--- |
| **Spring Boot App** | Max 384 MB | `-Xms64m -Xmx256m -XX:+UseG1GC`. Heap capped at 256MB; remainder covers Metaspace, thread stacks, and JIT compiler cache. Under typical load, RSS remains ~220–250MB. |
| **HikariCP Pool** | Minimal Overhead | `maximum-pool-size: 5`, `minimum-idle: 2`. Keeps database thread and buffer usage low. |
| **PostgreSQL 16** | Max 256 MB | Container capped at 256MB. Sufficient for moderate read/write inquiry and audit tables without starving system disk cache. |
| **System Headroom** | > 1.2 GB | Reserved for Ubuntu kernel, systemd services, Nginx reverse proxy, and Linux page cache. |

Total container memory limit: **640 MB** (`384MB + 256MB`), ensuring the system remains stable and responsive.

---

## 📁 Repository Structure

```text
├── docker-compose.yml         # Container orchestration (Backend + PostgreSQL)
├── .env.example               # Environment variables template (database credentials)
├── portfolio/                 # Frontend Web Application (Vue 3 + Vite)
│   ├── public/                # Static assets, WebP images, downloadable CV
│   ├── src/                   # Vue components (Hero, Work, ContactForm, Career, TechStack)
│   ├── scripts/               # Structural and interaction test runners
│   └── package.json           # Dependencies and build scripts
├── backend/                   # Backend API Service (Java 17 + Spring Boot 3)
│   ├── Dockerfile             # Multi-stage build (Maven Alpine -> Temurin JRE Alpine)
│   ├── src/main/java/         # Application code (Pragmatic CQRS architecture)
│   ├── src/main/resources/    # Configuration templates (application.properties)
│   └── pom.xml                # Maven project definition
└── infra/                     # Host Infrastructure Configuration Templates
    ├── nginx/                 # Nginx server block configuration for reverse proxy
    └── systemd/               # Optional bare-metal systemd unit file
```

---

## 🚀 Local Setup & Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- Node.js `>= 22.0.0` (for local frontend development)
- Java 17 & Maven (optional, only needed for running backend without Docker)

---

### Option A: Running with Docker Compose (Recommended)

1. **Clone repository and set up environment:**
   ```bash
   cp .env.example .env
   ```
   *(Review `.env` and configure passwords if needed. Defaults work for local testing).*

2. **Start Backend & PostgreSQL:**
   ```bash
   docker compose up --build -d
   ```

3. **Verify running containers:**
   ```bash
   docker compose ps
   ```
   - PostgreSQL runs on `internal-net` (not exposed to host port).
   - Backend API is available at `http://127.0.0.1:8080/api`.
   - Healthcheck endpoint: `http://127.0.0.1:8080/actuator/health`.

4. **Run Frontend locally:**
   ```bash
   cd portfolio
   npm ci
   npm run dev
   ```
   The frontend dev server runs at `http://127.0.0.1:5173`.

---

### Option B: Running Backend Manually (Without Docker)

1. Ensure a PostgreSQL instance is running on `localhost:5432`.
2. Configure environment properties:
   ```bash
   cd backend
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```
3. Run using the Maven Wrapper:
   ```bash
   ./mvnw clean compile
   ./mvnw spring-boot:run
   ```

---

## 📦 Deployment Strategy

### Frontend: Atomic Symlink Deployment

Frontend bundles are built and released without downtime using symlink switching:

```bash
# Example deployment target on VPS:
/var/www/diezaster/
├── releases/
│   ├── 2026-03-01_1000/
│   └── 2026-03-02_1200/
└── current -> /var/www/diezaster/releases/2026-03-02_1200/
```

- Nginx points its `root` directive to `/var/www/diezaster/current`.
- New versions deploy into a new timestamped directory.
- `ln -sfn /var/www/diezaster/releases/<new-release> /var/www/diezaster/current` updates the pointer atomically.
- Nginx immediately serves new assets without reloading or dropped requests.
- Automated via GitHub Actions CD workflow on push to `main` (see [docs/M8_CD_SETUP.md](docs/M8_CD_SETUP.md)).

### Backend: Containerized Service

- Managed by Docker Compose on the host.
- Multi-stage build isolates build tooling from the runtime image, yielding an Alpine JRE container image (~180MB).
- Runs under non-root system user `spring:spring` inside the container.
- Container restart policy set to `unless-stopped`.

---

## 🔒 Security & Privacy Practices

- **Zero Secrets in Repository:** No passwords, private keys, or API tokens are checked into version control. Environment variables are managed through `.env` files based on `.env.example`.
- **Network Isolation:** PostgreSQL port 5432 is not exposed to the host network interface. Only the backend container on `internal-net` can communicate with the database.
- **Loopback Binding:** Spring Boot exposes port 8080 exclusively to `127.0.0.1:8080`. External clients cannot access the backend directly; all incoming requests must route through host Nginx.
- **Privacy-Preserving Audit Log:** Submitter IP addresses are hashed using SHA-256 before insertion into audit records to prevent storing raw personally identifiable information (PII).
- **Least Privilege:** The backend process runs as an unprivileged `spring` user rather than root.
