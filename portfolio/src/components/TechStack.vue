<script setup>
import { techStack, tools } from '../data/portfolio.js'

const groups = [
  { title: 'Tech stack', directory: 'techstack', items: techStack },
  { title: 'Tools I use', directory: 'tools', items: tools },
]
</script>

<template>
  <section id="stack" class="stack-section section shell" aria-labelledby="stack-heading">
    <div class="stack-heading" data-reveal><p class="eyebrow">03 / THE WORKBENCH</p><h2 id="stack-heading">Tech stack & tools<span class="name-dot">.</span></h2></div>
    <div class="stack-layout">
      <div v-for="(group, index) in groups" :key="group.directory" class="stack-group" data-reveal :style="{ '--reveal-delay': `${index * 75}ms` }">
        <h3 class="eyebrow muted">{{ group.title }}</h3>
        <ul class="stack-items">
          <li v-for="item in group.items" :key="item.name" class="stack-item"><span class="stack-icon"><img :src="`/images/icons/${group.directory}/${item.icon}`" :class="{ 'icon-monochrome': item.monochrome }" alt="" width="28" height="28" loading="lazy" decoding="async" /></span><span>{{ item.name }}</span></li>
        </ul>
      </div>
    </div>
  </section>
</template>
