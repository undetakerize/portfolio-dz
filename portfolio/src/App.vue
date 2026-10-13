<script setup>
import { ref } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import SelectedWork from './components/SelectedWork.vue'
import CareerExperience from './components/CareerExperience.vue'
import ActionIcon from './components/ActionIcon.vue'
import TechStack from './components/TechStack.vue'
import ContactForm from './components/ContactForm.vue'
import { profile, skillGroups, education } from './data/portfolio.js'
import { useReveal } from './composables/useReveal.js'

useReveal()

const year = new Date().getFullYear()
const copyStatus = ref('')
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copyStatus.value = 'Email copied.'
  } catch {
    copyStatus.value = `Copy unavailable. Email me at ${profile.email}.`
  }
}
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <SiteHeader />
  <main id="main">
    <section id="home" class="hero shell" aria-labelledby="hero-heading">
      <div class="hero-type-layer" aria-hidden="true"><span>BACKEND</span><span>ENGINEER</span></div>
      <div class="hero-copy" data-reveal>
        <p class="eyebrow hero-kicker"><span class="pill-badge pill-badge-forest hero-kicker-pill"><ActionIcon name="sparkle" :fill="true" class="kicker-sparkle" /> JAVA / BACKEND ENGINEER</span></p>
        <h1 id="hero-heading">Adi<br />Hadiansyah<span class="name-dot">.</span></h1>
        <p class="hero-description">Reliable services.<br /><em>Practical backend solutions.</em></p>
        <p class="hero-intro">{{ profile.summary }}</p>
        <div class="hero-actions"><a class="button-primary" href="#experience">Explore my experience <ActionIcon name="down" /></a><a class="text-link" :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn <ActionIcon name="external" /><span class="sr-only"> (opens in a new tab)</span></a></div>
        <div class="hero-resume"><a class="resume-link" href="/cv/Adi_Hadiansyah_Backend_Engineer.pdf" download>Download backend CV <span class="mono">PDF</span><ActionIcon name="download" /></a></div>
      </div>
      <figure class="hero-portrait" data-reveal style="--reveal-delay: 100ms">
        <div class="portrait-frame">
          <div class="portrait-image"><img src="/images/adi-9489-optimized.webp" alt="Adi Hadiansyah wearing glasses beside a bicycle at a lakeside park" width="1200" height="1562" fetchpriority="high" /></div>
          <span class="portrait-badge pill-badge pill-badge-ochre"><ActionIcon name="sparkle" :fill="true" class="badge-sparkle" /> AVAILABLE FOR ROLES</span>
          <span class="portrait-stamp mono">JAVA / SPRING BOOT<br />BACKEND ENGINEERING</span>
        </div>
        <figcaption><span class="mono">ADI HADIANSYAH</span><span>{{ profile.location }}</span></figcaption>
      </figure>
      <div class="hero-bottom mono"><span>JAVA · SPRING BOOT · POSTGRESQL · KAFKA</span><a href="#experience">SCROLL TO EXPLORE <ActionIcon name="down" /></a></div>
    </section>
    <CareerExperience />
    <section id="about" class="about-section section" aria-labelledby="about-heading">
      <div class="shell about-layout">
        <div class="about-heading" data-reveal><p class="eyebrow">02 / SKILLS & ABOUT</p><h2 id="about-heading">Built for<br />the backend<span class="name-dot">.</span></h2><p class="about-note mono">RELIABILITY / MAINTAINABILITY / PERFORMANCE</p></div>
        <div class="about-copy" data-reveal style="--reveal-delay: 80ms"><p class="about-lead">From business requirements to services that hold up in production.</p><p>I work across API development, database optimization, event-driven integration, and production troubleshooting. I value clear service boundaries, reusable implementations, and changes that preserve existing business flows.</p><p>My earlier UI/UX experience helps me understand product requirements and collaborate with frontend teams. Backend engineering is the focus of my work today.</p><div class="focus-list"><div v-for="(group, index) in skillGroups" :key="group.title"><span class="mono">{{ String(index + 1).padStart(2, '0') }}</span><h3>{{ group.title }}</h3><p>{{ group.items }}</p></div></div><div class="education-list"><h3 class="eyebrow">EDUCATION</h3><div v-for="item in education" :key="item.school"><h4>{{ item.school }}</h4><p>{{ item.qualification }}</p><span class="mono">{{ item.period }}</span></div></div></div>
      </div>
    </section>
    <TechStack />
    <SelectedWork />
    <section id="contact" class="contact-section section shell" aria-labelledby="contact-heading" data-reveal>
      <div class="section-topline"><p class="eyebrow">05 / LET’S CONNECT</p></div>
      <h2 id="contact-heading">Good things start<br />with a conversation.</h2>
      <p class="contact-description">Have a project, a question, or an idea to exchange? I’d like to hear it.</p>
      <div class="contact-actions"><a class="email-link" :href="`mailto:${profile.email}`" :aria-label="`Email ${profile.name} at ${profile.email}`">{{ profile.email }} <ActionIcon name="mail" /></a><button class="copy-button mono" type="button" @click="copyEmail">Copy email</button></div>
      <p class="copy-status" role="status">{{ copyStatus }}</p>
      <ContactForm />
      <a class="text-link" :href="profile.linkedin" target="_blank" rel="noopener noreferrer">Find me on LinkedIn <ActionIcon name="external" /><span class="sr-only"> (opens in a new tab)</span></a>
    </section>
  </main>
  <footer class="site-footer shell"><a class="wordmark" href="#home">diezaster</a><span class="mono">© {{ year }} ADI HADIANSYAH</span><a class="mono" href="#home">BACK TO TOP <ActionIcon name="up" /></a></footer>
</template>
