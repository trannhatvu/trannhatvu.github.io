import { z } from 'zod';

export const writingSchema = z.object({
  title: z.string().meta({
    pagesCms: { type: 'string', required: true },
  }),
  description: z.string().meta({
    pagesCms: { type: 'text', required: true },
  }),
  date: z.coerce.date().meta({
    pagesCms: {
      type: 'date',
      required: true,
      options: { format: 'yyyy-MM-dd' },
    },
  }),
  lang: z.enum(['en', 'vi']).meta({
    pagesCms: {
      type: 'select',
      required: true,
      options: {
        values: [
          { name: 'en', label: 'English' },
          { name: 'vi', label: 'Tiếng Việt' },
        ],
      },
    },
  }),
  kind: z.enum(['article', 'tutorial', 'note']).meta({
    pagesCms: {
      type: 'select',
      required: true,
      options: { values: ['article', 'tutorial', 'note'] },
    },
  }),
  tags: z.array(z.string()).min(1).meta({
    pagesCms: { type: 'string', list: true, required: true },
  }),
  draft: z.boolean().default(false).meta({
    pagesCms: { type: 'boolean', default: false },
  }),
  starter: z.boolean().default(false).meta({
    pagesCms: { type: 'boolean', default: false },
  }),
});
