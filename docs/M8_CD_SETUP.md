# M8 Continuous Deployment (CD) Setup Guide

Automated zero-downtime Continuous Deployment pipeline for the Vue 3 frontend using GitHub Actions, SSH agent, and atomic symlink swapping on Ubuntu 24.04 LTS VPS.

---

## 1. Architecture & Pipeline Overview

Whenever commits are pushed to `main` with changes under `portfolio/**` (or when triggered manually via `workflow_dispatch`), the workflow `.github/workflows/cd.yml` executes the following sequence:

```text
[Push / Dispatch]
       │
       ▼
[Runner: Ubuntu Latest]
  ├── 1. Checkout repository (`actions/checkout@v4`)
  ├── 2. Setup Node.js 22 + npm cache (`actions/setup-node@v4`)
  ├── 3. Install dependencies (`npm ci` in `portfolio/`)
  ├── 4. Verification checks (`npm run check` in `portfolio/`)
  ├── 5. Production build (`npm run build` in `portfolio/` -> `dist/`)
  ├── 6. Archive compression (`dist-${RELEASE_NAME}.tar.gz`)
  ├── 7. Setup SSH agent with private key (`webfactory/ssh-agent@v0.9.0`)
  ├── 8. SCP archive transfer to VPS staging (`~/deploy/diezaster/`)
  ├── 9. Remote atomic promotion over SSH:
  │        • Unpack to `/var/www/diezaster/releases/${RELEASE_NAME}`
  │        • Chown to `www-data:www-data`, chmod 755 (dirs) / 644 (files)
  │        • Swap symlink atomically via `mv -Tf`
  │        • Prune older releases (retain 5 latest)
  │        • Clean up staging archive
  └── 10. Post-deployment smoke test (`curl -fsI https://adihadiansyah.site`)
```

---

## 2. Required GitHub Repository Secrets

Configure these secrets in your repository settings:
**GitHub Repo -> Settings -> Secrets and variables -> Actions -> New repository secret**

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `VPS_HOST` | Public IPv4 address or domain of the production VPS | `43.173.36.210` |
| `VPS_USER` | Remote SSH user with sudo rights | `ubuntu` |
| `VPS_SSH_KEY` | Private SSH ed25519 key for authentication | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

> ⚠️ **Security Invariant:** Never commit the private key to source code or git history. The workflow exclusively reads credentials from GitHub repository secrets.

---

## 3. VPS Prerequisites & Server Configuration

### A. Dedicated Deploy Key Setup (Recommended)

Generate an SSH key pair specifically for GitHub Actions deployment:

```bash
# On your local machine or VPS:
ssh-keygen -t ed25519 -C "github-actions-cd@diezaster" -f ~/.ssh/diezaster_deploy_ed25519 -N ""
```

1. **Public Key**: Add the contents of `diezaster_deploy_ed25519.pub` to `/home/ubuntu/.ssh/authorized_keys` on the VPS.
2. **Private Key**: Copy the entire contents of `diezaster_deploy_ed25519` into the `VPS_SSH_KEY` secret in GitHub.

### B. Remote Directories & Permissions

Ensure required directories exist with proper permissions:

```bash
# 1. Staging directory for incoming archives
mkdir -p /home/ubuntu/deploy/diezaster
chmod 700 /home/ubuntu/deploy/diezaster

# 2. Release storage directory
sudo mkdir -p /var/www/diezaster/releases
sudo chown -R www-data:www-data /var/www/diezaster
sudo chmod -R 755 /var/www/diezaster

# 3. Passwordless sudo for deploy user
# The deploy user (ubuntu) must be able to manage /var/www/diezaster without password prompt
sudo visudo -f /etc/sudoers.d/diezaster-deploy
```

Add the following rule:
```sudoers
ubuntu ALL=(ALL) NOPASSWD: /bin/mkdir, /bin/tar, /bin/chown, /bin/chmod, /bin/ln, /bin/mv, /bin/rm, /usr/bin/find, /bin/ls
```

### C. Nginx Root Configuration

Nginx serves the frontend directly from the atomic symlink:

```nginx
server {
    server_name adihadiansyah.site;
    root /var/www/diezaster/current;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # ... SSL and API proxy configuration ...
}
```

---

## 4. Manual Deployment & Testing

1. Navigate to **Actions** tab in GitHub.
2. Select **Continuous Deployment** workflow.
3. Click **Run workflow** -> Select `main` branch -> **Run workflow**.
4. Observe the step logs. Ensure all verification steps, SSH promotion, and the final `curl -fsI https://adihadiansyah.site` test pass with HTTP 200.

---

## 5. Instant Rollback Procedure

If a deployed release introduces regressions, roll back instantly by pointing the symlink to the previous release:

```bash
# SSH into VPS
ssh ubuntu@43.173.36.210

# List available releases
ls -1t /var/www/diezaster/releases

# Atomically switch symlink to the desired previous release
PREV_RELEASE="<insert-previous-timestamp-id>"
sudo ln -sfn "/var/www/diezaster/releases/${PREV_RELEASE}" /var/www/diezaster/current_tmp
sudo mv -Tf /var/www/diezaster/current_tmp /var/www/diezaster/current

# Verify active symlink target
readlink -f /var/www/diezaster/current
curl -fsI https://adihadiansyah.site
```
