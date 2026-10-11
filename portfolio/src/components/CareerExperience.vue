<script setup>
import { experience } from '../data/portfolio.js'
</script>

<template>
  <section id="experience" class="experience-section section shell" aria-labelledby="experience-heading">
    <div class="section-topline"><p class="eyebrow">01 / PROFESSIONAL EXPERIENCE</p><span class="eyebrow muted">BANDUNG, INDONESIA</span></div>
    <div class="section-heading-row" data-reveal>
      <h2 id="experience-heading">Behind the API.<br />Inside the business.</h2>
      <p>Building and maintaining the services behind enterprise operations and financial workflows.</p>
    </div>
    <div class="career-list">
      <article v-for="(job, index) in experience" :key="job.company" class="career-entry" :class="{ 'career-entry-secondary': index > 0 }" data-reveal>
        <div class="career-meta"><p class="mono career-period"><time :datetime="job.start">{{ job.period.split(' – ')[0] }}</time> – <time :datetime="job.end">{{ job.period.split(' – ')[1] }}</time></p><p class="eyebrow muted">{{ index === 0 ? 'BACKEND ENGINEERING' : 'EARLIER EXPERIENCE' }}</p></div>
        <div class="career-content"><h3>{{ job.role }}</h3><p class="career-company">{{ job.company }}</p><p class="career-summary">{{ job.summary }}</p><ul v-if="job.highlights" class="career-highlights"><li v-for="highlight in job.highlights" :key="highlight">{{ highlight }}</li></ul></div>
      </article>
    </div>
  </section>
</template>
