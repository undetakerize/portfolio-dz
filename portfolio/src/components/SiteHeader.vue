<script setup>
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme.js'
import ActionIcon from './ActionIcon.vue'

const menuOpen = ref(false)
const { theme, toggleTheme } = useTheme()
const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'Skills & about' },
  { href: '#stack', label: 'Stack & tools' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]
</script>

<template>
  <header class="site-header" @keydown.esc="menuOpen = false">
    <div class="header-inner shell">
      <a class="wordmark" href="#home" aria-label="Portfolio — home" @click="menuOpen = false">Portfolio<span class="name-dot" aria-hidden="true">.</span></a>
      <div class="header-controls">
        <button class="theme-toggle" type="button" aria-label="Dark mode" :aria-pressed="theme === 'dark'" :title="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`" @click="toggleTheme">
          <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z" /></svg>
          <span>{{ theme === 'dark' ? 'Dark' : 'Light' }}</span>
        </button>
      <button class="menu-toggle" type="button" aria-controls="main-navigation" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        {{ menuOpen ? 'Close' : 'Menu' }}<span aria-hidden="true">{{ menuOpen ? '−' : '+' }}</span>
      </button>
      </div>
      <nav id="main-navigation" class="main-nav" :class="{ 'is-open': menuOpen }" aria-label="Main navigation">
        <a v-for="link in links" :key="link.href" :href="link.href" @click="menuOpen = false">{{ link.label }}</a>
        <a class="nav-contact" href="mailto:adi.hdns@gmail.com">Email me <ActionIcon name="mail" /></a>
      </nav>
    </div>
  </header>
</template>
