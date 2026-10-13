<script setup>
import { experience } from '../data/portfolio.js'
import ActionIcon from './ActionIcon.vue'
</script>

<template>
  <section id="experience" class="experience-section section shell" aria-labelledby="experience-heading">
    <div class="section-topline"><p class="eyebrow">01 / EXPERIENCE</p><span class="eyebrow muted">BANDUNG, INDONESIA</span></div>
    <div class="section-heading-row" data-reveal>
      <h2 id="experience-heading">Behind the API.<br />Inside the business.</h2>
      <p>Building and maintaining the services behind enterprise operations and financial workflows.</p>
    </div>
    <div class="career-list">
      <article
        v-for="(job, index) in experience"
        :key="job.company"
        class="career-entry"
        :class="{ 'career-entry-highlight': index === 0, 'career-entry-secondary': index > 0, 'career-entry-retro-window': index === 0 }"
        data-reveal
      >
        <!-- RETRO OS WINDOW HEADER FOR PRIMARY ROLE (BTS.ID) -->
        <div v-if="index === 0" class="retro-window-header" aria-hidden="true">
          <div class="retro-window-title">
            <span class="retro-win-icon"></span>
            <span>C:\CAREER\BTS_ID\BACKEND_SERVICES.LOG</span>
          </div>
          <div class="retro-window-controls">
            <button class="retro-win-btn" type="button" aria-label="Minimize window">_</button>
            <button class="retro-win-btn" type="button" aria-label="Maximize window">□</button>
            <button class="retro-win-btn" type="button" aria-label="Close window">×</button>
          </div>
        </div>

        <div class="career-meta">
          <p class="mono career-period">
            <span class="career-period-pill pill-badge" :class="index === 0 ? 'pill-badge-ochre' : 'pill-badge-muted'">
              <ActionIcon name="sparkle" :fill="true" class="career-sparkle" />
              <time :datetime="job.start">{{ job.period.split(' – ')[0] }}</time> – <time :datetime="job.end">{{ job.period.split(' – ')[1] }}</time>
            </span>
          </p>
          <p class="eyebrow muted">{{ job.role.toUpperCase() }}</p>
        </div>
        <div class="career-content">
          <h3>{{ job.role }}</h3>
          <p class="career-company">{{ job.company }}</p>
          <p class="career-summary">{{ job.summary }}</p>
          <ul v-if="job.highlights" class="career-highlights">
            <li v-for="highlight in job.highlights" :key="highlight">{{ highlight }}</li>
          </ul>
          <div v-if="job.tags" class="career-tags">
            <span v-for="tag in job.tags" :key="tag" :class="index === 0 ? 'retro-tag-chip' : 'pill-badge pill-badge-muted'">{{ tag }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
