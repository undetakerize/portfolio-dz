<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { projects } from '../data/portfolio.js'
import ActionIcon from './ActionIcon.vue'

const categories = ['All work', 'Web development', 'UI design']
const category = ref('All work')
const archiveOpen = ref(false)
const archivePanel = ref(null)
const archiveButton = ref(null)
function toggleArchive() {
  if (archiveOpen.value && archivePanel.value?.contains(document.activeElement)) archiveButton.value?.focus()
  archiveOpen.value = !archiveOpen.value
}
const filteredProjects = computed(() => category.value === 'All work' ? projects : projects.filter(project => project.category === category.value))
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
    <div class="design-archive">
      <button ref="archiveButton" type="button" class="archive-summary" :aria-expanded="archiveOpen" aria-controls="design-archive-panel" @click="toggleArchive"><span><span class="eyebrow muted">EARLIER DESIGN WORK · 2021</span><span id="work-heading" class="archive-heading">A chapter before the backend.</span></span><span class="archive-toggle"><span>{{ archiveOpen ? 'Hide projects' : 'View 2 projects' }}</span><ActionIcon name="down" /></span></button>
      <div id="design-archive-panel" ref="archivePanel" class="archive-panel" :class="{ 'is-open': archiveOpen }" :inert="!archiveOpen" :aria-hidden="!archiveOpen">
      <div class="archive-body"><p class="archive-intro">Two personal web and interface concepts from 2021, preserved as an archive of my earlier design experience.</p>
    <div class="work-filters" role="group" aria-label="Filter selected work">
      <button v-for="item in categories" :key="item" type="button" :aria-pressed="category === item" @click="category = item">{{ item }}</button>
      <span class="work-count mono">{{ String(filteredProjects.length).padStart(2, '0') }} PROJECTS</span>
    </div>
    <div class="project-grid">
      <article v-for="(project, index) in filteredProjects" :key="project.id" class="project" :style="{ '--item-delay': `${index * 75}ms` }">
        <button class="project-image-button" type="button" :aria-label="`Read about ${project.name}`" @click="showProject(project, $event)">
          <img :src="project.image" :alt="project.alt" width="1200" height="627" loading="lazy" />
          <span class="image-action" aria-hidden="true">View details <ActionIcon name="details" /></span>
        </button>
        <div class="project-meta mono"><span>{{ project.category }}</span><span>{{ project.year }} / {{ project.number }}</span></div>
        <button class="project-title" type="button" @click="showProject(project, $event)">{{ project.name }}<span class="project-detail-label">View details <ActionIcon name="details" /></span></button>
        <p class="project-summary">{{ project.summary }}</p>
        <ul class="project-tags" aria-label="Project technologies"><li v-for="tag in project.tags" :key="tag">{{ tag }}</li></ul>
      </article>
    </div>
      </div>
      </div>
    </div>
    <dialog ref="dialog" class="project-dialog" aria-labelledby="project-dialog-title" @close="restoreFocus" @click="closeOnBackdrop">
      <template v-if="selected">
        <div class="dialog-top"><span class="eyebrow">PROJECT {{ selected.number }} / {{ selected.year }}</span><button autofocus type="button" class="dialog-close" aria-label="Close project details" @click="closeDialog">Close <span aria-hidden="true">×</span></button></div>
        <img :src="selected.image" :alt="selected.alt" width="1200" height="627" />
        <div class="dialog-content">
          <p class="eyebrow">{{ selected.role }}</p>
          <h2 id="project-dialog-title">{{ selected.name }}</h2>
          <p>{{ selected.description }}</p>
          <h3>The result</h3><p>{{ selected.outcome }}</p>
          <div class="dialog-links"><a v-for="link in selected.links" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }} <ActionIcon name="external" /><span class="sr-only"> (opens in a new tab)</span></a></div>
        </div>
      </template>
    </dialog>
  </section>
</template>
