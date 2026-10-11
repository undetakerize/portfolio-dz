import { onBeforeUnmount, onMounted } from 'vue'

// Content is visible by default; unsupported browsers and reduced motion skip reveal effects.
export function setupReveals(root = document, browser = window) {
  if (!browser.IntersectionObserver || browser.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {}
  const elements = [...root.querySelectorAll('[data-reveal]')]
  const observer = new browser.IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending')
        observer.unobserve(entry.target)
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
  for (const element of elements) {
    element.classList.add('reveal-pending')
    observer.observe(element)
  }
  return () => {
    observer.disconnect()
    elements.forEach(element => element.classList.remove('reveal-pending'))
  }
}

export function useReveal() {
  let cleanup = () => {}
  onMounted(() => { cleanup = setupReveals() })
  onBeforeUnmount(() => cleanup())
}
