# Raini’s Petit Coin

A bilingual, static personal blog about code, technology, everyday discoveries,
and life abroad. Built with Astro, TypeScript, Tailwind CSS, Markdown/MDX,
Pagefind, and Mermaid. No database, paid API, cookies, or analytics. The layout
is an original lightweight theme rather than a fork of AstroPaper.

## Run locally

Use Node **22.23.4 or newer** for direct npm commands (`nvm use` if you use nvm).
Install [Just](https://just.systems/) to use the shortcuts below.
Just runs its recipes with the pinned Node 22.23.4 runtime, even if your system
Node is older. The first run may download Node and npm through `npm exec`.

```sh
just install
just dev
```

If you prefer direct npm commands on a machine with older Node, run them under a
temporary, project-compatible runtime without changing the system installation:

```sh
npm exec --yes --package=node@22.23.4 --package=npm@10 --call 'npm ci && npm run dev'
```

The same wrapper can run `npm run check`, `npm run build`, or `npm run preview`.

Common helpers:

```sh
just                 # list available recipes
just check           # type-check
just pages-config    # regenerate Pages CMS config
just build           # build site and search index
just test            # build, then run static-site tests
just browser-install # install Chromium once for browser tests
just test-browser    # build, then run browser tests
just verify          # type-check, build, and run static tests
just verify-browser  # run all checks, including browser tests
just preview         # build, then preview the production site
```

Open the address printed by Astro. Search is generated after the production build,
so development mode displays an explanatory message instead of a broken index.

## Personalize before publishing

- Edit your display name and `portrait` path in [src/lib/site.ts](src/lib/site.ts).
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

### Edit with Pages CMS

The repository includes a Pages CMS configuration in [`.pages.yml`](.pages.yml).
After pushing it to GitHub, open [Pages CMS](https://app.pagescms.org), select
this repository, and choose **Writing (English)** or **Bài viết (Tiếng Việt)**
from the content navigation. The editor exposes the post metadata and a
rich-text Markdown body; saved changes go back to GitHub and trigger the normal
deployment workflow.

The checked-in configuration is generated from the Astro writing schema. After
changing that schema or its Pages CMS editor metadata, run `just pages-config`
and commit the updated `.pages.yml`. `just check` verifies that the generated
file is current.

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
- Use `kind: article` for essays and general writing; both articles and tutorials
  appear in Writing.
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

Fenced code blocks with a language get Shiki syntax highlighting, line numbers,
and copy buttons. For example, use `cpp` after the opening fence for C++.
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

The 8 remaining migrated WordPress posts are in the Vietnamese archive. The
6 retained authorized WordPress uploads are stored locally in
`public/images/wordpress/`; images from other sources remain links.

## Deploy to GitHub Pages

1. Create or use the repository **trannhatvu.github.io**, and push these files to
   its `main` branch.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. The included [deployment workflow](.github/workflows/deploy.yml) runs checks on
   pull requests targeting `main`. It deploys `dist/` only from `main`.
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

Automated Chromium coverage runs in the deployment workflow using the official
Playwright image matching the locked package version, with browser and OS
dependencies preinstalled. For local testing:

```sh
npx playwright install chromium
npm run test:browser
```

Build first. The runner starts a temporary production preview automatically,
or reuses an existing preview at port 4321 during local development.
