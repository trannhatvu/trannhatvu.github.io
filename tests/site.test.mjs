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

test('language-neutral core routes are generated at the site root', () => {
  for (const route of ['', 'writing/', 'notes/', 'about/', 'search/']) {
    const path = route ? `${route}index.html` : 'index.html';
    const html = read(path);
    assert.match(html, /<html[^>]+lang="en"/);
    assert.match(html, new RegExp(`rel="canonical" href="https://trannhatvu\\.github\\.io/${route}"`));
    assert.match(html, /href="#main"/);
    assert.doesNotMatch(html, /hreflang|language-link|data-pagefind-filter/);
  }
  assert.ok(!existsSync(new URL('en/index.html', root)), 'English routes should not use a language prefix');
  assert.ok(!existsSync(new URL('vi/index.html', root)), 'Vietnamese routes should not be generated');
  assert.ok(existsSync(new URL('404.html', root)));
  assert.match(read('index.html'), /Raini’s Petit Coin/);
});

test('content languages share routes without language-switch links', () => {
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /hreflang=|language-link|translation-link|data-pagefind-filter/, file);
    assert.doesNotMatch(html, /href="\/(?:en|vi)\//, file);
  }
  assert.ok(!existsSync(new URL('en/', root)));
  assert.ok(!existsSync(new URL('vi/', root)));
  assert.match(read('writing/gitlab-ci-first-pipeline/index.html'), /<html[^>]+lang="en"/);
  assert.match(read('writing/gitlab-ci-first-pipeline-vi/index.html'), /<html[^>]+lang="vi"/);
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

test('published articles have no language-switch or alternate-language links', () => {
  const article = read('writing/gitlab-ci-first-pipeline/index.html');
  assert.doesNotMatch(article, /translation-link|language-link|hreflang/);
});

test('article discussions use Giscus with the shared category and article language', () => {
  const english = read('writing/gitlab-ci-first-pipeline/index.html');
  const vietnamese = read('writing/gitlab-ci-first-pipeline-vi/index.html');
  for (const article of [english, vietnamese]) {
    assert.match(article, /src="https:\/\/giscus\.app\/client\.js"/);
    assert.match(article, /data-repo-id="R_kgDOVql-mw"/);
    assert.match(article, /data-category-id="DIC_kwDOVql-m84DK6nK"/);
    assert.match(article, /data-mapping="pathname"/);
    assert.match(article, /data-loading="lazy"/);
  }
  assert.match(english, /data-lang="en"/);
  assert.match(vietnamese, /data-lang="vi"/);
  assert.match(english, /id="discussion-heading">Discussion<\/h2>/);
  assert.match(vietnamese, /id="discussion-heading">Bình luận<\/h2>/);
});

test('drafts never leak and notes stay separate from writing archives', () => {
  for (const file of htmlFiles) assert.doesNotMatch(readFileSync(file, 'utf8'), /Unpublished draft fixture/);
  assert.ok(!existsSync(new URL('notes/unpublished-example/index.html', root)));
  assert.doesNotMatch(read('writing/index.html'), /A green log is not an exit code/);
  assert.match(read('notes/index.html'), /A green log is not an exit code/);
});

test('Vietnamese WordPress articles and their authorized images are published locally', () => {
  const writingDir = new URL('../src/content/writing/', import.meta.url);
  const migratedSlugs = [
    'c-su-dung-callback-voi-template',
    'gioi-thieu-tong-quan-design-pattern-trong-c',
    'google-io-2017-nhung-dieu-can-biet-google-home-lens-va-android-o',
    'lam-the-nao-de-viet-code-sach-nhung-bai-hoc-tu-the-clean-code-cua-robert-c-martin',
    'python-nhung-sai-lam-thuong-gap-cua-newbie-part-1',
    'tong-quan-bgp-vpn-interconnection-service',
    'tuong-lai-cua-nokia-va-5g',
    'wannacry-tai-sao-android-lai-la-noi-tru-an-truoc-ransomware',
  ];
  assert.ok(migratedSlugs.every(slug => existsSync(new URL(`${slug}.md`, writingDir))));
  for (const slug of [
    'pokemon-go-niantic-labs-co-ke-hoach-hoan-thien-them-truoc-khi-gioi-thieu-nhieu-hon',
    'co-vay-chien-thang-cuoi-cung-4-1-danh-cho-alphago-truoc-lee-sedol',
    'ovn-logical-flows-va-ovn-trace',
    'openstack-sdn-with-ovn-part-2-network-engineering-analysis',
    'gioi-thieu-ve-bagpipe',
    'ovn-gateway-high-availability-plan',
    'pycharm-settings-repository',
    'giai-ngo-entry-points-trong-python',
  ]) assert.ok(!existsSync(new URL(`writing/${slug}/index.html`, root)), `${slug} should be removed`);
  for (const slug of migratedSlugs) {
    const source = readFileSync(new URL(`${slug}.md`, writingDir), 'utf8');
    const article = read(`writing/${slug}/index.html`);
    assert.match(source, /^lang: vi$/m);
    assert.match(article, /<html[^>]+lang="vi"/);
    assert.match(article, /class="eyebrow">Article<\/p>/);
    assert.doesNotMatch(article, /<img\b[^>]*\bsrc="https?:\/\//i, `${slug} should not embed remote images`);
    assert.doesNotMatch(article, /<img\b[^>]*\bsrcset=/i, `${slug} should not retain WordPress srcset URLs`);
    for (const match of article.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
      assert.match(match[1], /^\/images\//, `${slug} should use an authorized local image`);
    }
  }
  for (const image of [
    'author-avatar.jpg',
    'small-functions-illustration.png',
    'clean-code-laptop-illustration.png',
    'nokia-5g-strategy-infographic.png',
    'android-wannacry-ransomware.jpg',
    'cpp-creational-design-patterns.png',
    'python-snake-illustration.png',
  ]) assert.ok(existsSync(new URL(`images/${image}`, root)), `Missing local image: ${image}`);
  assert.ok(!existsSync(new URL('images/wordpress/', root)), 'Image assets should not use a WordPress subdirectory');
  for (const image of [
    'pokemon-gp.jpg',
    'pokemon-go-1000x566.jpg',
    'goban-680x383.jpg',
    'ovn.png',
    'bagpipe-neutron-networks-ml2.png',
    'bagpipe-neutron-bgpvpn-interconnection.png',
  ]) {
    assert.ok(!existsSync(new URL(`images/${image}`, root)), `Removed post media should not be published: ${image}`);
  }
});

test('code, diagrams, metadata, and the shared multilingual search index are built', () => {
  const article = read('writing/gitlab-ci-first-pipeline/index.html');
  assert.match(article, /class="astro-code/);
  assert.match(article, /data-language="mermaid"/);
  assert.match(article, /data-pagefind-body/);
  assert.match(article, /property="og:type" content="article"/);
  assert.ok(existsSync(new URL('pagefind/pagefind.js', root)));
  const searchFiles = files(new URL('pagefind/', root).pathname);
  assert.ok(searchFiles.some(path => /\/pagefind\.en_/.test(path)), 'shared search index');
  assert.ok(!searchFiles.some(path => /\/pagefind\.vi_/.test(path)), 'only one index should be built');
  const index = JSON.parse(read('pagefind/pagefind-entry.json'));
  assert.deepEqual(Object.keys(index.languages), ['en']);
  assert.equal(index.languages.en.page_count, 14);
});

test('migrated article snippets use syntax-highlighted Shiki code blocks', () => {
  for (const { slug, language, count, legacyMarkup } of [
    { slug: 'c-su-dung-callback-voi-template', language: 'cpp', count: 2, legacyMarkup: /wp-block-syntaxhighlighter-code/ },
    { slug: 'lam-the-nao-de-viet-code-sach-nhung-bai-hoc-tu-the-clean-code-cua-robert-c-martin', language: 'java', count: 2, legacyMarkup: /js-file-line-container/ },
    { slug: 'gioi-thieu-tong-quan-design-pattern-trong-c', language: 'cpp', count: 5, legacyMarkup: /js-file-line-container/ },
    { slug: 'python-nhung-sai-lam-thuong-gap-cua-newbie-part-1', language: 'python', count: 8, legacyMarkup: /class="(?:k|nf|p|n|o|mi|mf|bp|c)"/ },
  ]) {
    const article = read(`writing/${slug}/index.html`);
    assert.equal((article.match(new RegExp(`data-language="${language}"`, 'g')) ?? []).length, count, slug);
    assert.match(article, new RegExp(`<pre class="astro-code[^"]*"[^>]*data-language="${language}"><code><span class="line">`), slug);
    assert.doesNotMatch(article, legacyMarkup, `${slug} should not retain old code markup`);
  }
});

test('built site is ready for branch-based GitHub Pages publishing', () => {
  assert.ok(existsSync(new URL('.nojekyll', root)), 'Jekyll must not hide Astro assets');
  assert.ok(files(root.pathname).some(path => path.includes('/_astro/')), 'Astro assets should be built');
});
