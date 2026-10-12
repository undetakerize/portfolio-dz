<script setup>
import { changelog } from '../data/changelog.js'
</script>

<template>
  <section id="changelog" class="changelog-section section shell" aria-labelledby="changelog-heading">
    <div class="section-topline">
      <p class="eyebrow">04 / SYSTEM CHANGELOG</p>
      <span class="eyebrow mono muted">The engineering behind this website</span>
    </div>
    <div class="section-heading-row" data-reveal>
      <h2 id="changelog-heading">System patch notes<span class="name-dot">.</span></h2>
      <p>Chronological releases tracking the infrastructure journey from bare-metal VPS genesis to container orchestration.</p>
    </div>
    <div class="changelog-list" role="list">
      <article
        v-for="(release, index) in changelog"
        :key="release.version"
        class="changelog-entry"
        :class="{ 'is-live': release.status === 'live' }"
        data-reveal
        :style="{ '--reveal-delay': `${index * 60}ms` }"
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
            <h3 class="changelog-title">{{ release.title }}</h3>
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
  </section>
</template>
