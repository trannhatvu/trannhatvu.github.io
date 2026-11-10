import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../dist/', import.meta.url);
assert.ok(existsSync(root), 'Run npm run build before npm test.');

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}
const htmlFiles = files(root.pathname).filter(path => path.endsWith('.html'));
const read = path => readFileSync(new URL(path, root), 'utf8');

test('English and Vietnamese core routes are generated with the correct language', () => {
  for (const lang of ['en', 'vi']) {
    for (const route of ['', 'writing/', 'notes/', 'about/', 'search/']) {
      const html = read(`${lang}/${route}index.html`);
      assert.match(html, new RegExp(`<html[^>]+lang="${lang}"`));
      assert.match(html, new RegExp(`rel="canonical" href="https://trannhatvu.github.io/${lang}/${route}"`));
      assert.match(html, /href="#main"/);
    }
  }
  assert.match(read('index.html'), /http-equiv="refresh" content="0;url=\/en\/"/);
  assert.ok(existsSync(new URL('404.html', root)));
});

test('all generated local links, assets, and heading anchors resolve', () => {
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const pathname = '/' + file.slice(root.pathname.length).replace(/index\.html$/, '');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = new URL(match[1].replaceAll('&amp;', '&'), `https://trannhatvu.github.io${pathname}`);
      if (target.origin !== 'https://trannhatvu.github.io') continue;
      const relative = decodeURIComponent(target.pathname).slice(1);
      const resolved = new URL(relative.endsWith('/') ? `${relative}index.html` : relative, root);
      assert.ok(existsSync(resolved), `${file}: missing ${target.pathname}`);
      if (target.hash && resolved.pathname.endsWith('.html')) {
        const destination = readFileSync(resolved, 'utf8');
        const id = decodeURIComponent(target.hash.slice(1));
        assert.ok(destination.includes(`id="${id}"`), `${file}: missing anchor ${id}`);
      }
    }
  }
});

test('only actual translations get reciprocal article links', () => {
  const en = read('en/writing/gitlab-ci-first-pipeline/index.html');
  const vi = read('vi/writing/gitlab-ci-first-pipeline/index.html');
  assert.match(en, /class="translation-link" href="\/vi\/writing\/gitlab-ci-first-pipeline\/"/);
  assert.match(vi, /class="translation-link" href="\/en\/writing\/gitlab-ci-first-pipeline\/"/);
  assert.doesNotMatch(read('en/writing/bash-scripts-that-fail-clearly/index.html'), /class="translation-link"/);
});

test('drafts never leak and notes stay separate from tutorial archives', () => {
  for (const file of htmlFiles) assert.doesNotMatch(readFileSync(file, 'utf8'), /Unpublished draft fixture/);
  assert.ok(!existsSync(new URL('en/notes/unpublished-example/index.html', root)));
  assert.doesNotMatch(read('en/writing/index.html'), /A green log is not an exit code/);
  assert.match(read('en/notes/index.html'), /A green log is not an exit code/);
  assert.doesNotMatch(read('vi/writing/index.html'), /Write Bash scripts that fail clearly/);
});

test('code, diagrams, metadata, and bilingual static search are built', () => {
  const article = read('en/writing/gitlab-ci-first-pipeline/index.html');
  assert.match(article, /class="astro-code/);
  assert.match(article, /data-language="mermaid"/);
  assert.match(article, /data-pagefind-body/);
  assert.match(article, /property="og:type" content="article"/);
  assert.ok(existsSync(new URL('pagefind/pagefind.js', root)));
  const searchFiles = files(new URL('pagefind/', root).pathname);
  assert.ok(searchFiles.some(path => /\/pagefind\.en_/.test(path)), 'English search index');
  assert.ok(searchFiles.some(path => /\/pagefind\.vi_/.test(path)), 'Vietnamese search index');
});

test('deployment checks and tests the exact artifact before publishing', () => {
  const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  for (const step of ['npm ci', 'npm run check', 'npm run build', 'npm test', 'actions/deploy-pages@']) assert.ok(workflow.includes(step));
  assert.match(workflow, /path: dist/);
  assert.match(workflow, /needs: build/);
});
