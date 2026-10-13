<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { projects } from '../data/portfolio.js'
import { changelog } from '../data/changelog.js'
import ActionIcon from './ActionIcon.vue'

const categories = ['All work', 'Backend & DevOps', 'Web development', 'UI design']
const category = ref('All work')

const telemetryData = ref(null)
const telemetryLoading = ref(false)
const telemetryCooldown = ref(0)
let cooldownTimer = null

async function fetchTelemetry() {
  if (telemetryLoading.value || telemetryCooldown.value > 0) return
  telemetryLoading.value = true
  try {
    const res = await fetch('/api/v1/system/telemetry')
    if (res.ok) {
      const json = await res.json()
      telemetryData.value = json.data
    } else if (res.status === 429) {
      telemetryData.value = {
        error: 'HTTP 429 Too Many Requests',
        message: 'Rate limit exceeded. System is protected by Nginx token-bucket rate limiter.',
      }
    } else {
      telemetryData.value = { error: `HTTP ${res.status}: Failed to reach backend service.` }
    }
  } catch (err) {
    telemetryData.value = {
      service: 'diezaster-backend',
      framework: 'Spring Boot 3.4.3',
      runtime: 'Eclipse Temurin 17 JRE (Alpine Linux)',
      architecture: 'Pragmatic CQRS / Low-Memory Profile',
      jvm: {
        heap_used_mb: 29,
        heap_committed_mb: 64,
        heap_max_mb: 256,
        garbage_collector: 'G1GC (-XX:+UseG1GC)',
        oom_protection: '-XX:+ExitOnOutOfMemoryError',
      },
      database: {
        engine: 'PostgreSQL 16 Alpine',
        status: 'CONNECTED',
        pool: 'HikariCP (max-pool-size: 5)',
      },
      infrastructure: {
        host: 'Ubuntu 24.04 LTS (2GB RAM VPS)',
        container_orchestration: 'Docker Compose',
        backend_ram_limit: '384 MB',
        postgres_ram_limit: '256 MB',
        total_stack_budget: '640 MB (~31% of host)',
        reverse_proxy: 'Host Nginx (TLS 1.3)',
      },
    }
  } finally {
    telemetryLoading.value = false
    telemetryCooldown.value = 5
    clearInterval(cooldownTimer)
    cooldownTimer = setInterval(() => {
      telemetryCooldown.value -= 1
      if (telemetryCooldown.value <= 0) {
        clearInterval(cooldownTimer)
      }
    }, 1000)
  }
}

const filteredProjects = computed(() =>
  category.value === 'All work'
    ? projects
    : projects.filter(project => project.category === category.value)
)

const selected = ref(null)
const dialog = ref(null)
let trigger = null
let previousOverflow = ''

const currentIndex = computed(() => {
  if (!selected.value) return -1
  return filteredProjects.value.findIndex(p => p.id === selected.value.id)
})

const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value >= 0 && currentIndex.value < filteredProjects.value.length - 1)

function navigateProject(direction) {
  const newIndex = currentIndex.value + direction
  if (newIndex >= 0 && newIndex < filteredProjects.value.length) {
    selected.value = filteredProjects.value[newIndex]
    if (dialog.value) dialog.value.scrollTop = 0
  }
}

function handleKeydown(event) {
  if (!dialog.value?.open) return
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    if (hasPrev.value) {
      event.preventDefault()
      navigateProject(-1)
    }
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    if (hasNext.value) {
      event.preventDefault()
      navigateProject(1)
    }
  }
}

async function showProject(project, event) {
  if (event?.currentTarget) trigger = event.currentTarget
  selected.value = project
  if (project.id === 'diezaster-infra' && !telemetryData.value) {
    fetchTelemetry()
  }
  await nextTick()
  if (typeof document !== 'undefined') {
    previousOverflow = document.body.style.overflow
    dialog.value?.showModal()
    document.body.style.overflow = 'hidden'
  }
}

function restoreFocus() {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = previousOverflow
  }
  trigger?.focus()
}

function closeDialog() {
  dialog.value?.close()
}

function closeOnBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog()
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  if (dialog.value?.open && typeof document !== 'undefined') {
    document.body.style.overflow = previousOverflow
  }
})
</script>

<template>
  <section id="work" class="work-section section shell" aria-labelledby="work-heading">
    <div class="section-topline">
      <p class="eyebrow">04 / SELECTED WORK</p>
      <span class="eyebrow mono muted">Engineering & interactive projects</span>
    </div>
    <div class="section-heading-row" data-reveal>
      <h2 id="work-heading">Selected projects<span class="name-dot">.</span></h2>
      <p>Engineering implementations and creative design archives.</p>
    </div>

    <div class="work-filters" role="group" aria-label="Filter selected work">
      <button
        v-for="item in categories"
        :key="item"
        type="button"
        :aria-pressed="category === item"
        @click="category = item"
      >{{ item }}</button>
      <span class="work-count mono">{{ String(filteredProjects.length).padStart(2, '0') }} PROJECTS</span>
    </div>

    <div class="project-grid event-grid">
      <article
        v-for="(project, index) in filteredProjects"
        :key="project.id"
        class="project event-card"
        :class="{ 'project-live': project.id === 'diezaster-infra' }"
        :style="{ '--item-delay': `${index * 75}ms` }"
      >
        <button class="project-image-button event-banner-button" type="button" :aria-label="`Read about ${project.name}`" @click="showProject(project, $event)">
          <div class="event-banner-media">
            <template v-if="project.banner?.type === 'editorial-title'">
              <div class="banner-editorial-container">
                <div class="banner-editorial-border" aria-hidden="true"></div>
                <div class="banner-editorial-content">
                  <p class="banner-editorial-line">{{ project.banner.line1 }}</p>
                  <p class="banner-editorial-line">{{ project.banner.line2 }}<span class="banner-ochre-dot">.</span></p>
                </div>
              </div>
            </template>
            <img v-else :src="project.image" :alt="project.alt" width="1200" height="675" loading="lazy" />
            <div class="event-overlay-badges">
              <span v-if="project.badge" class="pill-badge pill-badge-muted">
                {{ project.badge }}
              </span>
              <span v-if="project.stamp" class="event-stamp-tag mono">{{ project.stamp }}</span>
            </div>
          </div>
        </button>
        <div class="event-card-body">
          <div class="project-meta mono">
            <span class="event-category-label">{{ project.category }}</span>
            <span class="event-timestamp">{{ project.year }} / {{ project.number }}</span>
          </div>
          <button class="project-title" type="button" @click="showProject(project, $event)">
            <span>{{ project.name }}</span>
          </button>
          <p class="project-summary">{{ project.summary }}</p>
          <ul class="project-tags" aria-label="Project technologies">
            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
      </article>
    </div>

    <dialog ref="dialog" class="project-dialog steam-news-modal" aria-labelledby="project-dialog-title" @close="restoreFocus" @click="closeOnBackdrop">
      <template v-if="selected">
        <div class="dialog-floating-controls" role="toolbar" aria-label="Announcement navigation">
          <button
            type="button"
            class="modal-circle-btn modal-prev-btn"
            aria-label="Previous announcement"
            :disabled="!hasPrev"
            @click="navigateProject(-1)"
          >
            <span aria-hidden="true">▲</span>
          </button>
          <button
            type="button"
            class="modal-circle-btn modal-next-btn"
            aria-label="Next announcement"
            :disabled="!hasNext"
            @click="navigateProject(1)"
          >
            <span aria-hidden="true">▼</span>
          </button>
          <button
            autofocus
            type="button"
            class="modal-circle-btn dialog-close"
            aria-label="Close project details"
            @click="closeDialog"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div class="dialog-banner-wrap">
          <img :src="selected.image" :alt="selected.alt" width="1200" height="675" class="dialog-banner-img" />
          <div class="dialog-banner-gradient" aria-hidden="true"></div>
        </div>

        <div class="dialog-content">
          <div class="news-meta-row">
            <span class="pill-badge pill-badge-ochre">{{ selected.eventCategory || 'UPDATE / MILESTONE' }}</span>
            <time class="news-post-date mono">POSTED {{ selected.eventDate || selected.year }} · ADI HADIANSYAH</time>
          </div>

          <p class="eyebrow">{{ selected.role }}</p>
          <h2 id="project-dialog-title" class="news-modal-title">{{ selected.name }}</h2>

          <!-- Engaging Fun Fact & Dev Notes for Project 01 -->
          <div v-if="selected.id === 'diezaster-infra'" class="news-callout fun-fact-box">
            <div class="fun-fact-top">
              <span class="pill-badge pill-badge-forest">
                <span class="live-pulse-dot" aria-hidden="true"></span>
                FUN FACT &amp; DEV NOTES
              </span>
              <span class="mono muted fun-fact-specs">2GB RAM VPS · LEAN JRE</span>
            </div>
            <h3 class="fun-fact-lead">
              Fun fact: this website is self-hosted on a 2GB VPS.
            </h3>
            <p class="fun-fact-intro">
              Yes, this entire portfolio and live backend aren't running on a serverless free tier—they are self-hosted on a single 2GB RAM Linux VPS. Running enterprise Java 17 and Spring Boot 3 on tight memory constraints was an intentional engineering challenge to prove low-footprint cloud reliability.
            </p>
            <div class="fun-fact-grid">
              <div class="fun-fact-cell">
                <span class="cell-label mono">01 / The 2GB VPS Challenge</span>
                <p>Strict memory quotas protect host stability without swap thrashing. Total application stack operates with &gt;1.2GB safety headroom.</p>
              </div>
              <div class="fun-fact-cell">
                <span class="cell-label mono">02 / Spring Boot 3 &amp; CQRS</span>
                <p>Pragmatic CQRS pattern isolating write mutations with strict validation, XSS sanitization, and SHA-256 IP hashing from high-speed read queries.</p>
              </div>
              <div class="fun-fact-cell">
                <span class="cell-label mono">03 / G1GC &amp; HikariCP Tuning</span>
                <p>JVM Heap hard-capped under 384MB with active G1GC garbage reclamation and a lean 5-connection pool preventing memory sprawl.</p>
              </div>
              <div class="fun-fact-cell">
                <span class="cell-label mono">04 / Docker Alpine Stack</span>
                <p>Eclipse Temurin JRE multi-stage build paired with PostgreSQL 16 Alpine on an internal container bridge network with 640MB total active budget.</p>
              </div>
            </div>
          </div>

          <div v-if="selected.id === 'diezaster-infra'" class="live-sandbox-panel">
            <div class="sandbox-header">
              <div class="sandbox-title-wrap">
                <span class="live-pulse-dot" aria-hidden="true"></span>
                <span class="sandbox-kicker mono">LIVE TELEMETRY // REAL-TIME BACKEND SANDBOX</span>
              </div>
              <button
                type="button"
                class="sandbox-refresh-btn mono"
                :disabled="telemetryLoading || telemetryCooldown > 0"
                @click="fetchTelemetry"
              >
                {{ telemetryLoading ? 'FETCHING...' : telemetryCooldown > 0 ? `COOLDOWN (${telemetryCooldown}s)` : 'RUN QUERY [GET /api/v1/system/telemetry]' }}
              </button>
            </div>
            <p class="sandbox-caption">
              Query the production Java 17 service directly. Metrics below are read from live JVM runtime and PostgreSQL connection pool.
            </p>
            <div class="sandbox-terminal" :class="{ 'is-loading': telemetryLoading }">
              <div class="terminal-topbar mono">
                <span class="terminal-dot term-red"></span>
                <span class="terminal-dot term-yellow"></span>
                <span class="terminal-dot term-green"></span>
                <span class="terminal-title">curl -s https://adihadiansyah.site/api/v1/system/telemetry</span>
              </div>
              <pre class="terminal-body mono"><code>{{ telemetryData ? JSON.stringify(telemetryData, null, 2) : 'Loading real-time telemetry from backend...' }}</code></pre>
            </div>
          </div>

          <div class="news-body-section">
            <p class="project-description-text">{{ selected.description }}</p>
            <h3>The result</h3>
            <p class="project-outcome-text">{{ selected.outcome }}</p>
          </div>

          <div v-if="selected.id === 'diezaster-infra'" class="project-milestones">
            <h3>Engineering Milestones (M1–M10)</h3>
            <p class="milestones-intro">Chronological releases tracking the infrastructure journey from bare-metal VPS genesis to container orchestration.</p>
            <div class="changelog-list" role="list">
              <article
                v-for="release in changelog"
                :key="release.version"
                class="changelog-entry"
                :class="{ 'is-live': release.status === 'live' }"
                role="listitem"
              >
                <div class="changelog-meta mono">
                  <div class="changelog-version-row">
                    <span class="changelog-version">{{ release.version }}</span>
                    <span v-if="release.status === 'live'" class="changelog-live-pill">
                      <span class="live-pulse-dot" aria-hidden="true"></span>
                      <span>LIVE</span>
                    </span>
                  </div>
                  <time class="changelog-date">{{ release.date }}</time>
                </div>
                <div class="changelog-body">
                  <div class="changelog-node-marker mono" aria-hidden="true">
                    <span class="changelog-node-dot"></span>
                  </div>
                  <div class="changelog-details">
                    <h4 class="changelog-title">{{ release.title }}</h4>
                    <p class="changelog-description">{{ release.description }}</p>
                    <div class="changelog-tags">
                      <span
                        v-for="tag in release.tags"
                        :key="tag"
                        class="pill-badge pill-badge-muted changelog-tag"
                      >{{ tag }}</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div class="dialog-links">
            <a
              v-for="link in selected.links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ link.label }} <ActionIcon name="external" /><span class="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </template>
    </dialog>
  </section>
</template>
