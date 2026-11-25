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
  // top-level sections; Desarrollo (#dev) sits below Fotografía (Diseño was removed).
  for (const id of [
    'about',
    'services',
    'work',
    'fotografia',
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

test('photo lightbox opens and the close X actually closes it', async ({
  page,
}) => {
  await gotoApp(page)
  await page.locator('#fotografia .foto-btn').first().click()
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

  test('menu opens and closes; hidden links stay out of reach', async ({
    page,
  }) => {
    await gotoApp(page)
    const link = page.locator('.nav-links a').first()
    await expect(link).toBeHidden()
    await page.getByRole('button', { name: /Abrir menú|Open menu/i }).click()
    await expect(link).toBeVisible()
    await link.click()
    await expect(link).toBeHidden()
  })

  test('nav bar is opaque (content never shows through)', async ({ page }) => {
    await gotoApp(page)
    const bg = await page
      .locator('.nav')
      .evaluate((el) => getComputedStyle(el).backgroundColor)
    // rgb(...) has no alpha channel; rgba/color(... / a) would be translucent
    expect(bg).toMatch(/^rgb\(/)
  })
})

test.describe('tablet (820px)', () => {
  test.use({ viewport: { width: 820, height: 1180 } })

  test('uses the hamburger instead of a wrapped two-line bar', async ({
    page,
  }) => {
    await gotoApp(page)
    await expect(
      page.getByRole('button', { name: /Abrir menú|Open menu/i }),
    ).toBeVisible()
    const navH = await page
      .locator('.nav')
      .evaluate((el) => el.getBoundingClientRect().height)
    expect(navH).toBeLessThan(70)
  })
})
