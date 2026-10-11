# Infrastructure Configuration (VPS & Reverse Proxy)

This directory contains template configurations for deploying this portfolio on an Ubuntu Linux VPS with Nginx and Systemd.

## Architecture

- **Operating System:** Ubuntu 24.04 LTS
- **Reverse Proxy / Web Server:** Nginx (handles HTTPS Let's Encrypt + routes `/api/` to Spring Boot backend)
- **Application Runtime:** OpenJDK 17 Headless
- **Process Manager:** Systemd daemon
- **Database:** PostgreSQL 16

## Directory Structure

```
infra/
├── nginx/
│   └── diezaster-production.conf.example   # Nginx server block with SSL & reverse proxy setup
├── systemd/
│   └── diezaster-backend.service.example  # Systemd service with low-memory JVM tuning
└── README.md
```

## Quick Start on VPS

1. **Systemd Service Setup:**
   - Copy `infra/systemd/diezaster-backend.service.example` to `/etc/systemd/system/diezaster-backend.service`.
   - Update `User`, `WorkingDirectory`, and database environment variables.
   - Reload and enable:
     ```bash
     sudo systemctl daemon-reload
     sudo systemctl enable --now diezaster-backend
     ```

2. **Nginx Reverse Proxy Setup:**
   - Copy `infra/nginx/diezaster-production.conf.example` to `/etc/nginx/sites-available/your-domain`.
   - Update `server_name` and document root.
   - Symlink to `sites-enabled`:
     ```bash
     sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
     sudo nginx -t && sudo systemctl reload nginx
     ```

