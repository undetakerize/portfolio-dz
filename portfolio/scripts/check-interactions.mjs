import assert from 'node:assert/strict'
import { Window } from 'happy-dom'
import { fileURLToPath } from 'node:url'

// A DOM simulation for component behaviour, not browser/visual verification.
const window = new Window({ url: 'http://localhost:5173' })
const systemTheme = { matches: true, addEventListener() {}, removeEventListener() {} }
window.matchMedia = query => query.includes('prefers-color-scheme') ? systemTheme : { matches: false }
window.localStorage.setItem('diezaster-theme', 'light')
for (const name of ['window', 'document', 'HTMLElement', 'Element', 'SVGElement', 'Node', 'Event', 'MouseEvent']) {
  globalThis[name] = name === 'window' ? window : window[name]
}
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
window.HTMLDialogElement.prototype.showModal = function () { this.open = true }
window.HTMLDialogElement.prototype.close = function () {
  this.open = false
  this.dispatchEvent(new window.Event('close'))
}

const { build } = await import('vite')
const { createApp, nextTick } = await import('vue')
const root = fileURLToPath(new URL('../', import.meta.url))
const result = await build({
  root,
  logLevel: 'error',
  build: {
    write: false,
    minify: false,
    lib: { entry: `${root}/src/App.vue`, formats: ['es'], fileName: 'interaction-check' },
    rollupOptions: { external: ['vue'] },
  },
})
const output = (Array.isArray(result) ? result : [result]).flatMap(bundle => bundle.output)
const code = output.find(item => item.type === 'chunk' && item.isEntry).code
const vueUrl = import.meta.resolve('vue')
const { default: App } = await import(`data:text/javascript;base64,${Buffer.from(code.replaceAll('from "vue"', `from ${JSON.stringify(vueUrl)}`)).toString('base64')}`)
const mount = document.createElement('div')
document.body.append(mount)
const app = createApp(App)
app.mount(mount)

try {
  await nextTick()
  const themeButton = document.querySelector('.theme-toggle')
  assert.equal(document.documentElement.dataset.theme, 'light', 'Saved theme overrides the system dark preference')
  themeButton.click()
  await nextTick()
  assert.equal(document.documentElement.dataset.theme, 'dark')
  assert.equal(themeButton.getAttribute('aria-pressed'), 'true', 'Theme button exposes dark state')
  assert.equal(window.localStorage.getItem('diezaster-theme'), 'dark', 'Choice persists')
  themeButton.click()
  await nextTick()
  assert.equal(document.documentElement.dataset.theme, 'light')
  const menu = document.querySelector('.menu-toggle')
  menu.click()
  await nextTick()
  assert.equal(menu.getAttribute('aria-expanded'), 'true', 'Menu opens')
  document.querySelector('.main-nav a').click()
  await nextTick()
  assert.equal(menu.getAttribute('aria-expanded'), 'false', 'Navigation closes menu')

  const filters = [...document.querySelectorAll('.work-filters button')]
  assert.equal(document.querySelectorAll('.project').length, 4, 'All 4 projects visible initially')

  const backendFilter = filters.find(button => button.textContent === 'Backend & DevOps')
  assert(backendFilter, 'Backend & DevOps filter exists')
  backendFilter.click()
  await nextTick()
  assert.equal(document.querySelectorAll('.project').length, 2, 'Two Backend projects visible (Infra + Ledger)')
  assert(document.querySelector('.project').textContent.includes('Cloud Infrastructure'), 'Diezaster infra shown')

  const trigger = document.querySelector('.project-title')
  trigger.focus()
  trigger.click()
  await nextTick()
  await nextTick()
  const dialog = document.querySelector('dialog')
  assert(dialog.open, 'Project dialog opens through emulated dialog API')
  assert(dialog.textContent.includes('Cloud Infrastructure & Backend Playground'), 'Project title in dialog')
  assert(dialog.textContent.includes('Container Orchestration (M10)'), 'Milestones are embedded in dialog')
  assert(dialog.querySelector('.live-pulse-dot'), 'Live status indicator dot renders in milestone timeline')
  assert(dialog.textContent.includes('LIVE TELEMETRY // REAL-TIME BACKEND SANDBOX'), 'Live backend sandbox renders in modal')
  assert(dialog.querySelector('.sandbox-terminal'), 'Sandbox terminal component renders')
  assert.equal(document.body.style.overflow, 'hidden', 'Background scrolling is locked')
  document.querySelector('.dialog-close').click()
  await nextTick()
  assert(!dialog.open, 'Dialog closes')
  assert.equal(document.body.style.overflow, '')
  assert.equal(document.activeElement, trigger, 'Focus returns to trigger')

  filters.find(button => button.textContent === 'UI design').click()
  await nextTick()
  assert.equal(document.querySelectorAll('.project').length, 1, 'Only UI design project visible')
  assert(document.querySelector('.project').textContent.includes('Atarashii Gakko!'))

  filters.find(button => button.textContent === 'All work').click()
  await nextTick()
  assert.equal(document.querySelectorAll('.project').length, 4, 'All 4 projects visible again')

  // Verify Steam News Hub modal previous/next navigation across all 4 projects
  const firstTrigger = document.querySelector('.project-title')
  firstTrigger.click()
  await nextTick()
  await nextTick()
  assert(dialog.open, 'Dialog opened for Steam News modal navigation check')
  assert(dialog.textContent.includes('Cloud Infrastructure & Backend Playground'), 'Project 01 displayed initially')
  assert(dialog.textContent.includes('Fun fact: this website is self-hosted'), 'Fun Fact section rendered in modal')
  
  const prevBtn = dialog.querySelector('.modal-prev-btn')
  const nextBtn = dialog.querySelector('.modal-next-btn')
  assert(prevBtn, 'Previous announcement button exists')
  assert(nextBtn, 'Next announcement button exists')
  assert(prevBtn.disabled, 'Previous button disabled at first project')
  assert(!nextBtn.disabled, 'Next button enabled at first project')

  nextBtn.click()
  await nextTick()
  assert(dialog.textContent.includes('Financial Ledger'), 'Navigated to Project 02 (Financial Ledger)')
  assert(!prevBtn.disabled, 'Previous button enabled at Project 02')
  assert(!nextBtn.disabled, 'Next button enabled at Project 02')

  nextBtn.click()
  await nextTick()
  assert(dialog.textContent.includes('Bankaing'), 'Navigated to Project 03 (Bankaing)')
  assert(!prevBtn.disabled, 'Previous button enabled at Project 03')
  assert(!nextBtn.disabled, 'Next button enabled at Project 03')

  nextBtn.click()
  await nextTick()
  assert(dialog.textContent.includes('Atarashii Gakko!'), 'Navigated to Project 04 (Atarashii Gakko!)')
  assert(!prevBtn.disabled, 'Previous button enabled at Project 04')
  assert(nextBtn.disabled, 'Next button disabled at last project')

  prevBtn.click()
  await nextTick()
  assert(dialog.textContent.includes('Bankaing'), 'Navigated back to Project 03 (Bankaing)')

  dialog.querySelector('.dialog-close').click()
  await nextTick()
  assert(!dialog.open, 'Dialog closes from navigation check')

  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('clipboard unavailable') } } })
  document.querySelector('.copy-button').click()
  await new Promise(resolve => setTimeout(resolve, 0))
  assert(document.querySelector('[role="status"]').textContent.includes('Copy unavailable'), 'Clipboard failure gives a recovery message')
  let copied = ''
  navigator.clipboard.writeText = async value => { copied = value }
  document.querySelector('.copy-button').click()
  await new Promise(resolve => setTimeout(resolve, 0))
  assert.equal(copied, 'adi.hdns@gmail.com')
  assert.equal(document.querySelector('[role="status"]').textContent, 'Email copied.')
  console.log('PASS: theme override/toggle/persistence, menu, archive filtering, dialog focus and clipboard recovery.')
  console.log('DOM simulation only: native dialog keyboard behaviour and responsive screenshots still require a browser.')
} finally {
  app.unmount()
}

try {
  window.localStorage.removeItem('diezaster-theme')
  const secondApp = createApp(App)
  secondApp.mount(mount)
  await nextTick()
  assert.equal(document.documentElement.dataset.theme, 'dark', 'Without a saved choice, system dark mode applies')
  const originalStorage = window.localStorage
  Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('storage blocked') } })
  document.querySelector('.theme-toggle').click()
  await nextTick()
  assert.equal(document.documentElement.dataset.theme, 'light', 'Toggle works with blocked storage')
  Object.defineProperty(window, 'localStorage', { configurable: true, value: originalStorage })
  secondApp.unmount()

  const { setupReveals } = await import('../src/composables/useReveal.js')
  mount.innerHTML = '<div data-reveal>Always readable</div>'
  const element = mount.firstElementChild
  setupReveals(mount, { matchMedia: () => ({ matches: false }) })
  assert(!element.classList.contains('reveal-pending'), 'Unsupported browsers keep content visible')
  let reveal
  let disconnected = false
  class Observer {
    constructor(callback) { reveal = callback }
    observe() {}
    unobserve() {}
    disconnect() { disconnected = true }
  }
  setupReveals(mount, { IntersectionObserver: Observer, matchMedia: () => ({ matches: true }) })
  assert(!element.classList.contains('reveal-pending'), 'Reduced motion keeps content visible')
  const cleanup = setupReveals(mount, { IntersectionObserver: Observer, matchMedia: () => ({ matches: false }) })
  assert(element.classList.contains('reveal-pending'))
  reveal([{ target: element, isIntersecting: true }])
  assert(!element.classList.contains('reveal-pending'), 'Visible content reveals once observed')
  cleanup()
  assert(disconnected, 'Observer disconnects during cleanup')
  console.log('PASS: system theme, blocked-storage fallback, reveal/reduced-motion/unsupported-browser visibility and cleanup.')
} finally {
  await window.happyDOM.close()
}
