import { test, expect } from '@playwright/test'

// The Remotion intro plays once per session; skip it (via sessionStorage) so
// the hero is asserted directly. Pass { intro: true } to test the intro itself.
async function gotoApp(page, { intro = false } = {}) {
  if (!intro) {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem('introSeen', '1')
      } catch {
        /* sessionStorage may be unavailable pre-navigation */
      }
    })
  }
  // domcontentloaded (not 'load'): the SPA hydrates immediately and we don't
  // want to hang waiting on external Google Fonts / lazy 3D + video chunks.
  await page.goto('/', { waitUntil: 'domcontentloaded' })
}

test('hero loads with title and CTAs, no critical console errors', async ({
  page,
}) => {
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await gotoApp(page)

  await expect(page.locator('#top .hero-title')).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Conóceme|Get to know me/ }),
  ).toBeVisible()

  // Ignore headless WebGL/three noise — assert no real app errors.
  const critical = errors.filter(
    (e) => !/WebGL|Context Lost|THREE\.|favicon|deprecated/i.test(e),
  )
  expect(critical).toEqual([])
})

test('all main sections are present', async ({ page }) => {
  await gotoApp(page)
  for (const id of [
    'about',
    'services',
    'skills',
    'work',
    'fotografia',
    'career',
    'contact',
  ]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
})

test('theme toggle switches data-theme', async ({ page }) => {
  await gotoApp(page)
  const before = await page.locator('html').getAttribute('data-theme')
  await page.getByRole('button', { name: /modo|mode/i }).first().click()
  await expect
    .poll(() => page.locator('html').getAttribute('data-theme'))
    .not.toBe(before)
})

test('language toggle switches ES <-> EN', async ({ page }) => {
  await gotoApp(page)
  const firstNavLink = page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link')
    .first()
  const before = await firstNavLink.textContent()
  await page.getByRole('button', { name: /English|Español|spañol/i }).click()
  await expect.poll(() => firstNavLink.textContent()).not.toBe(before)
})

test('nav link jumps to the projects section', async ({ page }) => {
  await gotoApp(page)
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: /Proyectos|Work/ })
    .click()
  await expect(page).toHaveURL(/#work$/)
})

test('photography renders 8 photos', async ({ page }) => {
  await gotoApp(page)
  await expect(page.locator('.foto-item')).toHaveCount(8)
})

test('contact section is present', async ({ page }) => {
  await gotoApp(page)
  await expect(page.locator('#contact')).toBeVisible()
})

test('the intro plays on first visit and is skippable', async ({ page }) => {
  await gotoApp(page, { intro: true })
  const overlay = page.locator('.intro-overlay')
  await expect(overlay).toBeVisible()
  await page
    .getByRole('button', { name: /Saltar intro|Skip intro/ })
    .click()
  await expect(overlay).toBeHidden({ timeout: 3_000 })
})

test.describe('mobile (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('no horizontal overflow and hamburger menu present', async ({
    page,
  }) => {
    await gotoApp(page)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(overflow).toBe(false)
    await expect(
      page.getByRole('button', { name: /Abrir menú|Open menu|menu/i }),
    ).toBeVisible()
  })
})
