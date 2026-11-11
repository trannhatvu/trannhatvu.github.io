import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { writingSchema } from './content/writing-schema.mjs';

const writing = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/writing' }),
  schema: writingSchema,
});

export const collections = { writing };
