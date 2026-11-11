import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

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
  assert.match(read('en/index.html'), /Raini’s Petit Coin/);
  assert.match(read('index.html'), /Raini’s Petit Coin/);
});

test('all generated local links, assets, and heading anchors resolve', () => {
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8').replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, '');
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

test('drafts never leak and notes stay separate from writing archives', () => {
  for (const file of htmlFiles) assert.doesNotMatch(readFileSync(file, 'utf8'), /Unpublished draft fixture/);
  assert.ok(!existsSync(new URL('en/notes/unpublished-example/index.html', root)));
  assert.doesNotMatch(read('en/writing/index.html'), /A green log is not an exit code/);
  assert.match(read('en/notes/index.html'), /A green log is not an exit code/);
  assert.doesNotMatch(read('vi/writing/index.html'), /Write Bash scripts that fail clearly/);
});

test('all migrated WordPress articles and their authorized images are published locally', () => {
  const writingDir = new URL('../src/content/writing/vi/', import.meta.url);
  const migratedSlugs = readdirSync(writingDir)
    .filter(filename => filename.endsWith('.md'))
    .filter(filename => {
      const source = readFileSync(new URL(filename, writingDir), 'utf8');
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
      if (frontmatter === undefined) return false;
      const metadata = parse(frontmatter);
      return typeof metadata?.translationKey === 'string'
        && metadata.translationKey.startsWith('wordpress-');
    })
    .map(filename => filename.slice(0, -3));
  assert.equal(migratedSlugs.length, 8);
  for (const slug of [
    'pokemon-go-niantic-labs-co-ke-hoach-hoan-thien-them-truoc-khi-gioi-thieu-nhieu-hon',
    'co-vay-chien-thang-cuoi-cung-4-1-danh-cho-alphago-truoc-lee-sedol',
    'ovn-logical-flows-va-ovn-trace',
    'openstack-sdn-with-ovn-part-2-network-engineering-analysis',
    'gioi-thieu-ve-bagpipe',
    'ovn-gateway-high-availability-plan',
    'pycharm-settings-repository',
    'giai-ngo-entry-points-trong-python',
  ]) assert.ok(!existsSync(new URL(`vi/writing/${slug}/index.html`, root)), `${slug} should be removed`);
  for (const slug of migratedSlugs) {
    const article = read(`vi/writing/${slug}/index.html`);
    assert.match(article, /<html[^>]+lang="vi"/);
    assert.match(article, /class="eyebrow">Bài viết<\/p>/);
    assert.doesNotMatch(article, /<img\b[^>]*\bsrc="https?:\/\//i, `${slug} should not embed remote images`);
    assert.doesNotMatch(article, /<img\b[^>]*\bsrcset=/i, `${slug} should not retain WordPress srcset URLs`);
    for (const match of article.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
      assert.match(match[1], /^\/images\/wordpress\//, `${slug} should use an authorized local image`);
    }
  }
  for (const image of [
    'screen-shot-2016-02-29-at-10-08-14-am.png',
    '67d82-1-4gyjqwwkhbhw7mbx5pbkw.png',
    'cleancode.png',
    'wp.png',
    'python.png',
    'wannacry-android.jpg',
  ]) assert.ok(existsSync(new URL(`images/wordpress/${image}`, root)), `Missing migrated media: ${image}`);
  for (const image of [
    'pokemon-gp.jpg',
    'pokemon-go-1000x566.jpg',
    'goban-680x383.jpg',
    'ovn.png',
    'bagpipe-neutron-networks-ml2.png',
    'bagpipe-neutron-bgpvpn-interconnection.png',
  ]) {
    assert.ok(!existsSync(new URL(`images/wordpress/${image}`, root)), `Removed post media should not be published: ${image}`);
  }
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

test('migrated article snippets use syntax-highlighted Shiki code blocks', () => {
  for (const { slug, language, count, legacyMarkup } of [
    { slug: 'c-su-dung-callback-voi-template', language: 'cpp', count: 2, legacyMarkup: /wp-block-syntaxhighlighter-code/ },
    { slug: 'lam-the-nao-de-viet-code-sach-nhung-bai-hoc-tu-the-clean-code-cua-robert-c-martin', language: 'java', count: 2, legacyMarkup: /js-file-line-container/ },
    { slug: 'gioi-thieu-tong-quan-design-pattern-trong-c', language: 'cpp', count: 5, legacyMarkup: /js-file-line-container/ },
    { slug: 'python-nhung-sai-lam-thuong-gap-cua-newbie-part-1', language: 'python', count: 8, legacyMarkup: /class="(?:k|nf|p|n|o|mi|mf|bp|c)"/ },
  ]) {
    const article = read(`vi/writing/${slug}/index.html`);
    assert.equal((article.match(new RegExp(`data-language="${language}"`, 'g')) ?? []).length, count, slug);
    assert.match(article, new RegExp(`<pre class="astro-code[^"]*"[^>]*data-language="${language}"><code><span class="line">`), slug);
    assert.doesNotMatch(article, legacyMarkup, `${slug} should not retain old code markup`);
  }
});

test('deployment checks and tests the exact artifact before publishing', () => {
  const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  const config = parse(workflow);
  const lockfile = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
  for (const step of ['npm ci', 'npm run check', 'npm run build', 'npm test', 'actions/deploy-pages@']) assert.ok(workflow.includes(step));
  assert.match(workflow, /path: dist/);
  assert.match(workflow, /needs: build/);
  assert.equal(config.jobs.build.container.image, `mcr.microsoft.com/playwright:v${lockfile.packages['node_modules/@playwright/test'].version}-noble`);
  assert.match(config.jobs.build.container.options, /--ipc=host/);
  assert.doesNotMatch(workflow, /playwright install --with-deps/);
  assert.deepEqual(config.on.pull_request.branches, ['main']);
  assert.equal(config.jobs.deploy.if, "github.ref == 'refs/heads/main'");
  for (const name of ['Configure Pages', 'Upload site']) {
    const step = config.jobs.build.steps.find(candidate => candidate.name === name);
    assert.equal(step.if, config.jobs.deploy.if);
  }
});
