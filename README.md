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
├── portfolio/
│   ├── public/             # Static assets (favicons, optimized WebP images, downloadable CV)
│   ├── src/
│   │   ├── components/     # Vue components (Hero, Work, Career, TechStack, Header)
│   │   ├── composables/    # Reactive state (theme toggle, viewport reveal observer)
│   │   ├── data/           # Portfolio data schema (career, projects, skills)
│   │   ├── App.vue         # Main application layout
│   │   ├── main.js         # Vue entry point
│   │   └── style.css       # Design tokens, color system, typography & utilities
│   ├── scripts/            # Component verification & interaction checks
│   ├── package.json        # Dependencies & scripts
│   └── vite.config.js      # Vite configuration
└── .gitignore              # Git ignore rules
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
