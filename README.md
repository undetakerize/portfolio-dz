# Adi Hadiansyah — Portfolio Website

Personal portfolio website and engineering showcase for **Adi Hadiansyah** (Backend Engineer). Built with Vue 3 and Vite, deployed on an Ubuntu Linux VPS with Nginx and automated release management.

🌐 **Live Website:** [adihadiansyah.site](https://adihadiansyah.site)

---

## 🛠️ Tech Stack

### Web Application
- **Framework:** Vue 3 (Composition API)
- **Build Tool / Bundler:** Vite
- **Styling:** Vanilla CSS with custom design tokens, dark/light theme switching, and responsive layout
- **Typography:** Self-hosted local fonts (`@fontsource-variable/manrope`, `@fontsource/dm-mono`)
- **Assets:** High-efficiency WebP imagery (~75–85% size reduction)
- **DOM & SSR Validation:** Happy-DOM for interaction simulation and SSR verification

### Core Engineering Domains (Backend)
- **Languages & Frameworks:** Java, Spring Boot, SQL, REST APIs
- **Data & Messaging:** PostgreSQL, MySQL, Apache Kafka
- **Infrastructure & Systems:** Linux (Ubuntu LTS), Nginx Reverse Proxy, Bash scripting, systemd, TLS/HTTPS (Let's Encrypt)
- **Deployment Strategy:** Atomic zero-downtime symlink releases (`current -> releases/<timestamp>`)

---

## 📁 Repository Structure

```text
├── portfolio/              # Frontend Web Application (Vue 3 + Vite)
│   ├── public/             # Static assets (favicons, optimized WebP images, downloadable CV)
│   ├── src/                # Vue components (Hero, Work, ContactForm, Career, TechStack)
│   ├── scripts/            # Component verification & interaction checks
│   └── package.json        # Dependencies & scripts
├── backend/                # Backend API Service (Java 17 + Spring Boot 3 + PostgreSQL)
│   ├── src/main/java/      # Clean Architecture + Pragmatic CQRS implementation
│   ├── src/main/resources/ # application.properties (.example template provided)
│   └── pom.xml             # Maven configuration
├── infra/                  # VPS Infrastructure & Deployment Templates
│   ├── nginx/              # Nginx reverse proxy configuration template
│   └── systemd/            # Systemd service unit template with JVM tuning
└── .gitignore              # Production-safe Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 22.0.0`
- npm `>= 10.0.0`

### Installation & Development

```bash
# Navigate to the portfolio project directory
cd portfolio

# Install dependencies
npm ci

# Run development server
npm run dev
```

### Verification & Production Build

```bash
# Run interaction tests and structural checks
npm run check

# Generate production bundle
npm run build

# Preview production build locally
npm run preview
```

The production output will be generated inside `portfolio/dist/`.

---

## ☕ Backend Service (Spring Boot 3 + Pragmatic CQRS)

The backend handles inquiry submissions and audit logging with a low-memory footprint:

- **Framework:** Spring Boot 3.4.3 (Java 17)
- **Architecture:** Pragmatic CQRS (Command Model with validation/XSS sanitization/SHA-256 IP hashing + Query Model with read-only projection)
- **Database:** PostgreSQL 16
- **Memory Footprint:** Tuned with JVM `-Xms64m -Xmx256m` and HikariCP maximum 5 connections (~220 MB RAM in production).

### Running Backend Locally

```bash
cd backend
# 1. Copy environment template
cp src/main/resources/application.properties.example src/main/resources/application.properties

# 2. Run with Maven Wrapper
./mvnw clean compile
./mvnw spring-boot:run
```
