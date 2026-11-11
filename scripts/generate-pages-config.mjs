import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { writingSchema } from '../src/content/writing-schema.mjs';

const configPath = fileURLToPath(new URL('../.pages.yml', import.meta.url));
const checkOnly = process.argv.includes('--check');

const languages = [
  { code: 'en', label: 'English', collectionLabel: 'Writing (English)' },
  { code: 'vi', label: 'Tiếng Việt', collectionLabel: 'Bài viết (Tiếng Việt)' },
];

function fieldsFor(language) {
  const fields = Object.entries(writingSchema.shape).map(([name, schema]) => {
    const metadata = schema.meta()?.pagesCms;
    if (!metadata) {
      throw new Error(`Missing Pages CMS metadata for writing field "${name}".`);
    }

    const field = structuredClone(metadata);
    if (name === 'lang') {
      field.options.values = [{ name: language.code, label: language.label }];
    }

    return { name, ...field };
  });

  fields.push({
    name: 'body',
    label: language.code === 'en' ? 'Content' : 'Nội dung',
    type: 'rich-text',
    options: {
      format: 'markdown',
      media: 'writing_images',
      path: 'writing',
    },
  });

  return fields;
}

const config = {
  media: [
    {
      name: 'writing_images',
      label: 'Writing images',
      input: 'public/images',
      output: '/images',
      categories: ['image'],
      extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      rename: 'safe',
    },
  ],
  content: languages.map((language) => ({
    name: `writing-${language.code}`,
    label: language.collectionLabel,
    type: 'collection',
    path: `src/content/writing/${language.code}`,
    format: 'yaml-frontmatter',
    filename: '{primary}.md',
    fields: fieldsFor(language),
    view: {
      fields: ['title', 'date', 'kind', 'draft'],
      primary: 'title',
      sort: ['date', 'title'],
      default: { sort: 'date', order: 'desc' },
    },
  })),
};

const generated = stringify(config, { lineWidth: 0 });
let current = '';
try {
  current = await readFile(configPath, 'utf8');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

if (checkOnly) {
  if (current !== generated) {
    throw new Error('Pages CMS config is stale. Run `npm run pages:config`.');
  }
  console.log('Pages CMS config is up to date.');
} else if (current !== generated) {
  await writeFile(configPath, generated);
  console.log('Generated .pages.yml from the Astro writing schema.');
} else {
  console.log('.pages.yml is already up to date.');
}
