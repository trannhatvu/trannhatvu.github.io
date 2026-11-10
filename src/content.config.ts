import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'vi']),
    kind: z.enum(['tutorial', 'note']),
    tags: z.array(z.string()).min(1),
    translationKey: z.string(),
    draft: z.boolean().default(false),
    starter: z.boolean().default(false),
  }),
});

export const collections = { writing };
