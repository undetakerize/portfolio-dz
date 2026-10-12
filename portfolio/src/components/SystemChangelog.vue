<script setup>
import { ref, computed } from 'vue'
import ActionIcon from './ActionIcon.vue'
import { changelog } from '../data/changelog.js'

const expanded = ref(false)
const DEFAULT_VISIBLE = 3

const visibleReleases = computed(() => (expanded.value ? changelog : changelog.slice(0, DEFAULT_VISIBLE)))
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
        v-for="(release, index) in visibleReleases"
        :key="release.version"
        class="changelog-entry"
        :class="{ 'is-live': release.status === 'live' }"
        data-reveal
        :style="{ '--reveal-delay': `${(index >= DEFAULT_VISIBLE ? index - DEFAULT_VISIBLE : index) * 60}ms` }"
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
    <div v-if="changelog.length > DEFAULT_VISIBLE" class="changelog-actions">
      <button
        type="button"
        class="changelog-toggle-button"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        <span>{{ expanded ? 'Hide earlier releases' : `View earlier releases (${changelog.length - DEFAULT_VISIBLE} archived)` }}</span>
        <ActionIcon name="down" />
      </button>
    </div>
  </section>
</template>
