import { onBeforeUnmount, onMounted, ref } from 'vue'

const storageKey = 'diezaster-theme'

export function readSavedTheme() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

export function useTheme() {
  const theme = ref('light')
  let media
  let explicitChoice = false

  function applyTheme(value) {
    theme.value = value
    document.documentElement.dataset.theme = value
    document.documentElement.style.colorScheme = value
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#171916' : '#f5f3ed')
  }

  function followSystem(event) {
    if (!explicitChoice) applyTheme(event.matches ? 'dark' : 'light')
  }

  function toggleTheme() {
    explicitChoice = true
    const next = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(next)
    try { window.localStorage.setItem(storageKey, next) } catch { /* Theme still works when storage is blocked. */ }
  }

  onMounted(() => {
    media = window.matchMedia?.('(prefers-color-scheme: dark)')
    const saved = readSavedTheme()
    explicitChoice = saved !== null
    applyTheme(saved ?? (media?.matches ? 'dark' : 'light'))
    media?.addEventListener?.('change', followSystem)
  })

  onBeforeUnmount(() => media?.removeEventListener?.('change', followSystem))
  return { theme, toggleTheme }
}
