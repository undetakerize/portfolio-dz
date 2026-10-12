<script setup>
import { experience } from '../data/portfolio.js'
import ActionIcon from './ActionIcon.vue'
</script>

<template>
  <section id="experience" class="experience-section section shell" aria-labelledby="experience-heading">
    <div class="section-topline"><p class="eyebrow">01 / PROFESSIONAL EXPERIENCE</p><span class="eyebrow muted">BANDUNG, INDONESIA</span></div>
    <div class="section-heading-row" data-reveal>
      <h2 id="experience-heading">Behind the API.<br />Inside the business.</h2>
      <p>Building and maintaining the services behind enterprise operations and financial workflows.</p>
    </div>
    <div class="career-list">
      <article
        v-for="(job, index) in experience"
        :key="job.company"
        class="career-entry"
        :class="{ 'career-entry-highlight': index === 0, 'career-entry-secondary': index > 0 }"
        data-reveal
      >
        <div class="career-meta">
          <p class="mono career-period">
            <span class="career-period-pill pill-badge" :class="index === 0 ? 'pill-badge-ochre' : 'pill-badge-muted'">
              <ActionIcon name="sparkle" :fill="true" class="career-sparkle" />
              <time :datetime="job.start">{{ job.period.split(' – ')[0] }}</time> – <time :datetime="job.end">{{ job.period.split(' – ')[1] }}</time>
            </span>
          </p>
          <p class="eyebrow" :class="index === 0 ? 'career-category-lead' : 'muted'">
            {{ index === 0 ? 'CORE BACKEND ENGINEERING' : 'EARLIER EXPERIENCE' }}
          </p>
        </div>
        <div class="career-content">
          <h3>{{ job.role }}</h3>
          <p class="career-company">{{ job.company }}</p>
          <p class="career-summary">{{ job.summary }}</p>
          <ul v-if="job.highlights" class="career-highlights">
            <li v-for="highlight in job.highlights" :key="highlight">{{ highlight }}</li>
          </ul>
          <div v-if="job.tags" class="career-tags">
            <span v-for="tag in job.tags" :key="tag" class="pill-badge pill-badge-muted">{{ tag }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
