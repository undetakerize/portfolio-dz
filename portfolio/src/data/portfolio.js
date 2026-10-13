export const profile = {
  name: 'Adi Hadiansyah',
  role: 'Java / Backend Engineer',
  email: 'adi.hdns@gmail.com',
  linkedin: 'https://www.linkedin.com/in/adihdns/',
  location: 'Bandung, Indonesia',
  summary: 'Backend Engineer with 4+ years of experience building and maintaining enterprise applications using Java and Spring Boot. My focus is reliable APIs, efficient data processing, and maintainable services.',
}

// Career dates and capabilities are sourced from Adi_Hadiansyah.pdf.
// Do not turn past employment into a current role or invent impact metrics.
export const experience = [
  {
    company: 'PT. Intersolusi Teknologi Asia (BTS.id)',
    role: 'Backend Developer',
    period: 'Nov 2021 – Jul 2026',
    start: '2021-11',
    end: '2026-07',
    summary: 'Enterprise services for operational and financial applications.',
    highlights: [
      'Developed RESTful services with Java, Spring Boot, and PostgreSQL for vehicle and patrol operations, asset lifecycle management, financial journaling, purchasing workflows, and direct payments.',
      'Optimized SQL queries and backend processing; refactored legacy code and shared utilities while preserving existing business flows.',
      'Implemented Kafka-based data synchronization and inter-service communication, plus Server-Sent Events (SSE) for real-time frontend updates.',
      'Validated changes with functional smoke tests and mock-based unit tests; investigated service, integration, and data issues in production.',
      'Worked with QA, frontend developers, business analysts, and users from requirement analysis through testing, deployment support, and post-release troubleshooting in Agile/Scrum teams.',
    ],
    tags: ['#Java', '#SpringBoot', '#PostgreSQL', '#REST-APIs'],
  },
  {
    company: 'PT. Digital Amore Kriyanesia',
    role: 'UI/UX Designer',
    period: 'Jul 2021 – Oct 2021',
    start: '2021-07',
    end: '2021-10',
    summary: 'Earlier design foundation before transitioning fully into backend engineering. Led web interface redesigns and digital assets for client platforms.',
    highlights: [
      'Redesigned a client financial web portal, transforming legacy structures into clean information architecture, intuitive user flows, and responsive layouts.',
      'Audited legacy web pages, resolved mobile responsiveness bottlenecks, and crafted interactive high-fidelity prototypes in Figma across savings, deposit, and loan services.',
      'Created digital graphic assets and iterative UI specifications presented directly to stakeholders and product teams.',
    ],
    tags: ['#Figma', '#UI/UX', '#DesignSystems', '#Wireframing'],
  },
]

export const skillGroups = [
  { title: 'Backend engineering', items: 'Java · Spring Boot · RESTful APIs · Reusable service design · Legacy refactoring' },
  { title: 'Data & performance', items: 'PostgreSQL · SQL · Relational database design · Query optimization · Backend performance tuning' },
  { title: 'Messaging & real-time', items: 'Apache Kafka · Event-driven integration · Server-Sent Events (SSE)' },
  { title: 'Testing & reliability', items: 'Functional smoke testing · Mock-based unit testing · Debugging · Production troubleshooting' },
  { title: 'Delivery & collaboration', items: 'Git · Agile / Scrum · Requirement analysis · Cross-functional collaboration · Deployment support' },
  { title: 'AI-assisted engineering', items: 'Code analysis · Debugging · Documentation · Technical research · Solution prototyping' },
]

export const education = [
  { school: 'Widyatama University', qualification: 'Bachelor of Computer Science', period: 'Sep 2016 – Nov 2020' },
  { school: 'SMK Kartika XIX-1 Bandung', qualification: 'Network Engineering', period: 'Aug 2013 – Jun 2016' },
]

// User-provided SVG collection. No proficiency scores or new employment claims.
export const techStack = [
  { name: 'Java', icon: 'java-original.svg' },
  { name: 'Spring', icon: 'spring-original.svg' },
  { name: 'PostgreSQL', icon: 'postgresql-original-wordmark.svg' },
  { name: 'Apache Kafka', icon: 'apachekafka-original.svg', monochrome: true },
  { name: 'TypeScript', icon: 'typescript-original.svg' },
  { name: 'NestJS', icon: 'nestjs-original.svg' },
  { name: 'C#', icon: 'csharp-original.svg' },
  { name: '.NET Core', icon: 'dotnetcore-original.svg' },
]

export const tools = [
  { name: 'IntelliJ IDEA', icon: 'intellij-original.svg' },
  { name: 'DBeaver', icon: 'dbeaver-original.svg' },
  { name: 'Insomnia', icon: 'insomnia-original.svg' },
  { name: 'Figma', icon: 'figma-original.svg' },
]

export const projects = [
  {
    id: 'diezaster-infra',
    number: '01',
    name: 'Cloud Infrastructure & Backend Playground',
    category: 'Backend & DevOps',
    year: '2026',
    image: '/images/diezaster-infra.webp',
    alt: 'System architecture diagram and production container playground on a Linux VPS',
    summary: 'A self-hosted production backend and containerized cloud architecture on an Ubuntu VPS, engineered under a strict 2GB RAM budget.',
    tags: ['Java 17', 'Spring Boot 3', 'PostgreSQL 16', 'Docker Compose', 'Nginx Reverse Proxy', 'CQRS'],
    role: 'Backend engineering & DevOps',
    description: 'Production architecture powering this portfolio and backend services. Designed to prove pragmatic backend engineering on resource-constrained cloud infrastructure (2GB RAM). Features Spring Boot 3 implementing Pragmatic CQRS (command validation, XSS sanitization, SHA-256 IP hashing), HikariCP pool tuning (max 5 connections), and PostgreSQL 16 Alpine containerization with hard memory caps (total 640MB budget leaving >1.2GB system headroom). Deployed via atomic zero-downtime symlink switches and TLS automated renewal.',
    outcome: 'A live, resilient, low-memory production environment running on adihadiansyah.site. Restored from zero with Docker multi-stage builds and fully isolated database networks.',
    links: [
      { label: 'View live contact API', url: 'https://adihadiansyah.site/api/v1/contact/recent' },
      { label: 'GitHub repository & architecture', url: 'https://github.com/undetakerize/portfolio-dz' },
    ],
  },
  {
    id: 'bankaing',
    number: '02',
    name: 'Bankaing',
    category: 'Web development',
    year: '2021',
    image: '/images/bankaing.webp',
    alt: 'Bankaing landing page: digital banking headline and illustrated mobile banking interface',
    summary: 'A digital banking concept, brought from interface design to a responsive landing page.',
    tags: ['HTML', 'SCSS', 'JavaScript'],
    role: 'Web design & frontend development',
    description: 'A frontend concept for a digital banking service. The project explores a clear introduction, an illustrated product story, and a responsive web layout using HTML, SCSS and JavaScript.',
    outcome: 'A landing page implementation accompanied by its original Figma design. This is a frontend concept, not a live banking service.',
    links: [
      { label: 'View live project', url: 'https://bankaing-sample.netlify.app/' },
      { label: 'Open Figma design', url: 'https://www.figma.com/file/T3plutVIq0bBo6HAbkuwoZ/Web-Bank-bankaing?node-id=0%3A1' },
    ],
  },
  {
    id: 'atarashii-gakko',
    number: '03',
    name: 'Atarashii Gakko!',
    category: 'UI design',
    year: '2021',
    image: '/images/atarashii-gakko.webp',
    alt: 'Atarashii Gakko website concept with angled music photography and bold typography',
    summary: 'An expressive website concept inspired by the energy and visual identity of a Japanese music group.',
    tags: ['Figma', 'UI design', 'Prototyping'],
    role: 'Interface design & prototyping',
    description: 'A Figma website concept inspired by Atarashii Gakko. Angled compositions, expressive type and music imagery create a distinctive direction for the group’s digital presence.',
    outcome: 'A visual interface prototype preserved from the original 2021 portfolio. This is a personal design concept, not an official band website.',
    links: [
      { label: 'Open Figma prototype', url: 'https://www.figma.com/file/AA2o6ZaS1YYhy1l6wj7Nsc/Project-新しい学校のリーダーズ-Website?node-id=1%3A2' },
    ],
  },
]
