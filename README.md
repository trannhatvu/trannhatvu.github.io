# Engineering notebook

A bilingual, static personal blog built with Astro, TypeScript, Tailwind CSS,
Markdown/MDX, Pagefind, and Mermaid. No database, paid API, cookies, or analytics.
The layout is an original lightweight theme rather than a fork of AstroPaper.

## Run locally

Use Node **22.23.4 or newer** (`nvm use` if you use nvm).

```sh
npm ci
npm run dev
```

If the machine has an older Node and you do not use nvm, run the project under a
temporary, project-compatible runtime without changing the system installation:

```sh
npm exec --yes --package=node@22.23.4 --package=npm@10 --call 'npm ci && npm run dev'
```

The same wrapper can run `npm run check`, `npm run build`, or `npm run preview`.

For the complete site, including search:

```sh
npm run check
npm run build
npm test
npm run preview
```

Open the address printed by Astro. Search is generated after the production build,
so development mode displays an explanatory message instead of a broken index.

## Personalize before publishing

- Edit your name and `portrait` path in [src/lib/site.ts](src/lib/site.ts).
  Put your own photo in `public/images/` and use `/images/your-photo.webp`.
  Initials are deliberately used until a real portrait is provided.
- Update both versions of the About page text in [src/lib/site.ts](src/lib/site.ts).
- Review or replace the starter articles. They are labeled visibly through
  `starter: true`; set that to `false` after adapting them.
- If your GitHub username differs, update `site` in
  [astro.config.mjs](astro.config.mjs) and `url` in
  [src/lib/site.ts](src/lib/site.ts).

System fonts support Vietnamese without external font requests. The theme follows
your OS initially; an explicit choice is stored locally in your browser.

## Publish a post

Create a Markdown file in `src/content/writing/en/` or `src/content/writing/vi/`.
GitHub's **Add file → Create new file** editor is sufficient. Commit to `main` to
build and publish automatically after Pages has been enabled.

```yaml
---
title: "Your article title"
description: "A short, useful summary."
date: 2026-11-11
lang: en
kind: tutorial
tags: ["GitLab CI", "Automation"]
translationKey: your-article
draft: false
starter: false
---
```

- Use `kind: note` for the separate Notes feed.
- Filenames become URLs: `en/example.md` becomes `/en/writing/example/`
  (or `/en/notes/example/` for a note).
- Use URL-safe, lowercase filenames. Keep tags consistently named.
- A Vietnamese translation uses `lang: vi` and the same `translationKey`. Filenames
  may differ. Translation links appear only when both published versions exist.
- Each language has its own lists, topics, and search index. No automatic
  translation or browser-language redirects.
- Dates control ordering, **not scheduled publishing**. Set `draft: true` to
  exclude unfinished content. Drafts are not rendered even in local development.
- Future interactive components can be imported from `.mdx` articles.

### Code, diagrams, and images

Fenced code blocks with a language get syntax highlighting and copy buttons.
Use a `mermaid` fence for diagrams; Mermaid loads only when a diagram is present.
Invalid diagrams show an explicit error and preserve their source.

Keep screenshots in `public/images/`, reference them as `/images/filename.webp`,
and provide meaningful alt text. For a caption, use:

```html
<figure>
  <img src="/images/pipeline.webp" alt="The check stage passing in GitLab" loading="lazy" />
  <figcaption>The smallest useful pipeline: one check stage.</figcaption>
</figure>
```

## Deploy to GitHub Pages

1. Create or use the repository **trannhatvu.github.io**, and push these files to
   its `main` branch.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. The included [deployment workflow](.github/workflows/deploy.yml) installs from
   the lockfile, type-checks, builds, tests, and deploys `dist/`.
4. Visit `https://trannhatvu.github.io/`. The root leads to `/en/`; Vietnamese lives
   at `/vi/`. No custom domain is needed.

This configuration is for a user-site repository at the domain root, not a
project site hosted under a repository subpath. No GitHub repository is created
or published by the local setup itself.

## Validation

`npm test` checks the **built** site: local links and anchors, canonical URLs,
language routes, reciprocal translations, draft exclusion, syntax highlighting,
search output, and the deployment workflow. Build before running it.

Manually check search in both languages, mobile navigation, keyboard focus,
light/dark persistence, copy buttons, and diagram rendering after UI changes.

Automated Chromium coverage is also available and runs in the deployment workflow:

```sh
npx playwright install chromium
npm run test:browser
```

Build first. The runner starts a temporary production preview automatically,
or reuses an existing preview at port 4321 during local development.
