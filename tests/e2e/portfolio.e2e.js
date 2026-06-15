import { test, expect } from '@playwright/test'

async function gotoApp(page) {
  // domcontentloaded (not 'load'): the SPA hydrates immediately and we don't
  // want to hang waiting on external Google Fonts / the lazy 3D chunk.
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
  // Skills + Career now live inside About (disclosure panels), so they're not
  // top-level sections; Diseño (#design) + Desarrollo (#dev) sit below Fotografía.
  for (const id of [
    'about',
    'services',
    'work',
    'fotografia',
    'design',
    'dev',
    'contact',
  ]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
})

test('theme toggle switches data-theme', async ({ page }) => {
  await gotoApp(page)
  const before = await page.locator('html').getAttribute('data-theme')
  await page
    .getByRole('button', { name: /modo|mode/i })
    .first()
    .click()
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

test('nav link jumps to the videos section', async ({ page }) => {
  await gotoApp(page)
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: /Videos/ })
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

test('tejidas gallery opens and the close X actually closes it', async ({
  page,
}) => {
  await gotoApp(page)
  // open the brand-book gallery (the design card opens a lightbox)
  await page.locator('#design .project-link[role="button"]').first().click()
  const lightbox = page.locator('.lightbox')
  await expect(lightbox).toBeVisible()
  // the close X must be the top element at its spot (it's portalled to <body>,
  // not trapped under the fixed nav) and must close the modal
  await page.locator('.lightbox-close').click()
  await expect(lightbox).toHaveCount(0)
})

test('About discloses Skills + Career on click', async ({ page }) => {
  await gotoApp(page)
  const skillsTrigger = page
    .locator('#about .about-panel-trigger')
    .filter({ hasText: /Habilidades|Skills/ })
  await expect(skillsTrigger).toHaveAttribute('aria-expanded', 'false')
  await skillsTrigger.click()
  await expect(skillsTrigger).toHaveAttribute('aria-expanded', 'true')
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
