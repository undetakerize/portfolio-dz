import assert from 'node:assert/strict'
import { stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp } from 'vue'
import { projects, profile, experience, skillGroups, education } from '../src/data/portfolio.js'
import { changelog } from '../src/data/changelog.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.vue')
  const html = await renderToString(createSSRApp(App))
  assert(html.includes(profile.name), 'Profile name renders')
  assert(html.includes(profile.email), 'Contact email renders')
  assert(html.includes('JAVA / BACKEND ENGINEER'), 'Confirmed role renders')
  assert(html.includes('4+ years'), 'Experience summary from CV renders')
  for (const job of experience) {
    assert(html.includes(job.company), 'CV employer renders')
    assert(html.includes(`datetime="${job.start}"`), 'Career start date renders')
    assert(html.includes(`datetime="${job.end}"`), 'Career end date renders')
  }
  assert(html.indexOf('id="experience"') < html.indexOf('id="work"'), 'Career takes priority over design archive')
  for (const group of skillGroups) assert(html.includes(group.title.replaceAll('&', '&amp;')), 'CV skills render')
  for (const item of education) assert(html.includes(item.school), 'Education renders')
  const cvPath = '/cv/Adi_Hadiansyah_Backend_Engineer.pdf'
  assert(html.includes(`href="${cvPath}" download`), 'CV is linked as a download')
  assert((await stat(`${root}/public${cvPath}`)).size > 0, 'Downloadable CV exists')
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length, 'HTML IDs are unique')
  for (const [, target] of html.matchAll(/\bhref="#([^"]+)"/g)) {
    assert(ids.includes(target), `Anchor #${target} resolves`)
  }
  assert(!html.includes('href="#"'), 'No inert placeholder links')
  assert(!html.includes('<iframe'), 'No automatic external Figma embeds')
  assert(html.includes(`mailto:${profile.email}`), 'Email action is a mailto link')
  assert.equal(projects.length, 3, 'All 3 showcase projects are preserved')
  const infraProject = projects.find(p => p.id === 'diezaster-infra')
  assert(infraProject, 'Cloud infrastructure project is present')
  assert.equal(infraProject.year, '2026', 'Infrastructure project has year 2026')
  assert(html.includes(infraProject.name.replaceAll('&', '&amp;')), 'Infrastructure project renders in SSR')
  for (const link of infraProject.links) {
    assert(link.url.startsWith('https://'), `Project link ${link.url} uses https:`)
  }
  for (const project of projects) {
    assert(html.includes(project.name.replaceAll('&', '&amp;')), `${project.name} renders`)
    assert(project.year === '2026' || project.year === '2021', `${project.name} has valid year`)
    assert(project.links.length > 0, 'Project has a source link')
    for (const link of project.links) assert.equal(new URL(link.url).protocol, 'https:')
  }
  assert(changelog.length >= 5, 'Engineering milestones preserved')
  for (const entry of changelog) {
    assert(entry.version && entry.title && entry.description, `Changelog entry ${entry.version} is complete`)
  }
  const imagePaths = [...html.matchAll(/\bsrc="(\/images\/[^"]+)"/g)].map(match => match[1])
  for (const asset of imagePaths) {
    assert((await stat(`${root}/public${asset}`)).size > 0, `Local asset ${asset} exists`)
  }
  console.log('PASS: Vue SSR render, CV career/skills/education, backend priority, downloadable PDF, unique IDs, navigation, email and archive assets.')
  console.log('Browser interaction and responsive visual review require a connected browser; this check does not replace them.')
} finally {
  await server.close()
}
