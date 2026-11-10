import { test, expect } from '@playwright/test';

test('homepage is readable and navigable at desktop and mobile widths', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make it work.Understand why.');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.getByRole('heading', { level: 1 }).click();
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Search', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Switch color theme' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 375 || width === 1280) {
      await page.screenshot({ path: testInfo.outputPath(`homepage-${width}.png`), fullPage: true });
    }
  }
  expect(errors).toEqual([]);
  expect(requests.every(url => url.startsWith('http://127.0.0.1:4321/'))).toBe(true);
  expect(requests.some(url => /mermaid|pagefind/.test(url))).toBe(false);
  await page.getByRole('navigation').getByRole('link', { name: 'Notes' }).click();
  await expect(page).toHaveURL(/\/en\/notes\/$/);
  await expect(page.getByRole('heading', { name: 'A green log is not an exit code' })).toBeVisible();
});

test('theme choice persists across reload and language navigation', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch color theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Switch color theme' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Read in Vietnamese', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Đổi giao diện sáng tối' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('search finds English posts, handles no results, and clears cleanly', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/en/search/');
  const input = page.getByRole('searchbox');
  await input.fill('pipeline');
  await expect(page.locator('.search-results li').first()).toBeVisible();
  await expect(page.locator('.search-results')).toContainText('A small GitLab CI pipeline');
  const links = await page.locator('.search-results a').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
  expect(links.every(link => link?.startsWith('/en/'))).toBe(true);
  await input.fill('zzzznotarealword');
  await expect(page.getByRole('status')).toHaveText('No results. Try a different word.');
  await expect(page.locator('.search-results li')).toHaveCount(0);
  await input.fill('');
  await expect(page.getByRole('status')).toHaveText('');
  expect(errors).toEqual([]);
});

test('Vietnamese search uses its own index and supports accented queries', async ({ page }) => {
  await page.goto('/vi/search/');
  await page.getByRole('searchbox').fill('kiểm tra');
  await expect(page.locator('.search-results li')).toHaveCount(1);
  await expect(page.locator('.search-results')).toContainText('Một pipeline GitLab CI nhỏ');
  await expect(page.locator('.search-results a')).toHaveAttribute('href', '/vi/writing/gitlab-ci-first-pipeline/');
});

test('search reports an index loading failure explicitly', async ({ page }) => {
  await page.route('**/pagefind/pagefind.js', route => route.abort());
  await page.goto('/en/search/');
  await page.getByRole('searchbox').fill('pipeline');
  await expect(page.getByRole('status')).toHaveText('Search could not load. Please reload and try again.');
});

test('articles render diagrams, copy exact code, and link only real translations', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/en/writing/gitlab-ci-first-pipeline/');
  await expect(page.locator('.diagram svg')).toBeVisible();
  await expect(page.locator('.code-block')).toHaveCount(2);
  const code = await page.locator('.code-block code').first().textContent();
  await page.getByRole('button', { name: 'Copy', exact: true }).first().click();
  await expect(page.locator('.copy-status')).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(code);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.toc summary')).toBeVisible();
  await page.locator('.toc summary').click();
  await expect(page.locator('.toc ol')).toBeHidden();
  await page.locator('.translation-link').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
  await expect(page.locator('.diagram svg')).toBeVisible();
  await page.goto('/en/writing/bash-scripts-that-fail-clearly/');
  await expect(page.locator('.translation-link')).toHaveCount(0);
  await expect(page.locator('.language-link')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('content remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/en/writing/gitlab-ci-first-pipeline/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('pre[data-language="mermaid"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Switch color theme' })).toBeHidden();
  await page.goto('http://127.0.0.1:4321/en/search/');
  await expect(page.locator('noscript p')).toBeVisible();
  await expect(page.locator('noscript p')).toContainText('Search needs JavaScript.');
  await context.close();
});

test('diagram loading errors preserve the source and explain the failure', async ({ page }) => {
  await page.route('**/_astro/mermaid.core.*.js', route => route.abort());
  await page.goto('/en/writing/gitlab-ci-first-pipeline/');
  await expect(page.getByRole('alert')).toHaveText('The diagram could not render. Its source is shown below.');
  await expect(page.locator('pre[data-language="mermaid"]')).toBeVisible();
  await expect(page.locator('.diagram')).toHaveCount(0);
});
