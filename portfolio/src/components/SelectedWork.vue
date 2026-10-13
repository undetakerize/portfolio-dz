<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { projects } from '../data/portfolio.js'
import { changelog } from '../data/changelog.js'
import ActionIcon from './ActionIcon.vue'

const categories = ['All work', 'Backend & DevOps', 'Web development', 'UI design']
const category = ref('All work')

const filteredProjects = computed(() =>
  category.value === 'All work'
    ? projects
    : projects.filter(project => project.category === category.value)
)

const selected = ref(null)
const dialog = ref(null)
let trigger = null
let previousOverflow = ''

async function showProject(project, event) {
  trigger = event.currentTarget
  selected.value = project
  await nextTick()
  previousOverflow = document.body.style.overflow
  dialog.value.showModal()
  document.body.style.overflow = 'hidden'
}

function restoreFocus() {
  document.body.style.overflow = previousOverflow
  trigger?.focus()
}

function closeDialog() {
  dialog.value.close()
}

function closeOnBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog()
}

onBeforeUnmount(() => {
  if (dialog.value?.open) document.body.style.overflow = previousOverflow
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

    <div class="project-grid">
      <article
        v-for="(project, index) in filteredProjects"
        :key="project.id"
        class="project"
        :class="{ 'project-featured': project.id === 'diezaster-infra' }"
        :style="{ '--item-delay': `${index * 75}ms` }"
      >
        <button class="project-image-button" type="button" :aria-label="`Read about ${project.name}`" @click="showProject(project, $event)">
          <img :src="project.image" :alt="project.alt" width="1200" height="627" loading="lazy" />
          <span class="image-action" aria-hidden="true">View details <ActionIcon name="details" /></span>
        </button>
        <div class="project-meta mono">
          <span>{{ project.category }}</span>
          <span>{{ project.year }} / {{ project.number }}</span>
        </div>
        <button class="project-title" type="button" @click="showProject(project, $event)">
          {{ project.name }}
          <span class="project-detail-label">View details <ActionIcon name="details" /></span>
        </button>
        <p class="project-summary">{{ project.summary }}</p>
        <ul class="project-tags" aria-label="Project technologies">
          <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
        </ul>
      </article>
    </div>

    <dialog ref="dialog" class="project-dialog" aria-labelledby="project-dialog-title" @close="restoreFocus" @click="closeOnBackdrop">
      <template v-if="selected">
        <div class="dialog-top">
          <span class="eyebrow">PROJECT {{ selected.number }} / {{ selected.year }}</span>
          <button autofocus type="button" class="dialog-close" aria-label="Close project details" @click="closeDialog">
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <img :src="selected.image" :alt="selected.alt" width="1200" height="627" />
        <div class="dialog-content">
          <p class="eyebrow">{{ selected.role }}</p>
          <h2 id="project-dialog-title">{{ selected.name }}</h2>
          <p>{{ selected.description }}</p>
          <h3>The result</h3>
          <p>{{ selected.outcome }}</p>

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
