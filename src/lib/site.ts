import { getCollection, type CollectionEntry } from 'astro:content';

export const site = {
  name: 'Raini’s Petit Coin',
  title: 'A little corner for curious minds',
  url: 'https://trannhatvu.github.io',
  portrait: '/images/author-avatar.jpg',
};

export type Entry = CollectionEntry<'writing'>;
export type Language = 'en' | 'vi';

export const text = {
  writing: 'Writing', notes: 'Notes', about: 'About', search: 'Search',
  skip: 'Skip to content', theme: 'Switch color theme',
  eyebrow: 'CODE / TECH / LIFE ABROAD',
  intro: 'Code, curiosity,\nand life abroad.',
  description: 'A personal blog about code, technology, everyday discoveries, and life abroad.',
  browse: 'Explore the writing', latest: 'Latest writing', allWriting: 'All writing',
  recentNotes: 'Short notes', allNotes: 'All notes', topics: 'Explore a topic',
  article: 'Article', tutorial: 'Tutorial', note: 'Note', minute: 'min read',
  back: 'Back to writing', toc: 'On this page',
  starter: 'Starter content — adapt this article before making it your own.',
  empty: 'Nothing here yet. Good notes take a little time.',
  footer: 'Built to be read. Kept deliberately simple.',
  searchDescription: 'Find a command, a concept, or your next rabbit hole.',
  searchLabel: 'Search the notebook', searchPlaceholder: 'Try “pipeline” or “Bash”…',
  searchHint: 'Search published articles in English and Vietnamese. No tracking or external service.',
  searchLoading: 'Searching…', searchEmpty: 'No results. Try a different word.',
  searchError: 'Search could not load. Please reload and try again.',
  searchDev: 'Search is available in the production preview. Run npm run build, then npm run preview.',
  results: 'results', copy: 'Copy', copied: 'Copied', copyError: 'Copy failed',
  diagramError: 'The diagram could not render. Its source is shown below.',
  notesDescription: 'Small discoveries worth keeping. Less ceremony, same curiosity.',
  writingDescription: 'Stories and ideas about code, technology, and life beyond the screen.',
  tagged: 'Filed under', allTopics: 'All topics',
  aboutTitle: 'A little corner of my world.',
  aboutLead: 'A place to share what I’m learning, building, and noticing along the way.',
  aboutBody: 'Raini’s Petit Coin is where I write about programming, technology, life abroad, and anything else that sparks my curiosity.',
  aboutSecond: 'I try to leave the reasoning in, not just the answer: what I tested, what failed, and why I kept the final approach.',
  notFound: 'This page wandered off.',
};

export async function published() {
  const entries = await getCollection('writing', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export function entryUrl(entry: Entry) {
  const slug = entry.id.split('/').at(-1);
  return `/${entry.data.kind === 'note' ? 'notes' : 'writing'}/${slug}/`;
}

export function tagSlug(tag: string) {
  return tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function dateLabel(date: Date, lang: Language) {
  return new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

export function readingTime(entry: Entry) {
  const body = (entry.body ?? '').replace(/<\/?[A-Za-z][^>]*>/g, ' ').replace(/&(?:#\d+|#x[\da-f]+|[a-z]+);/gi, ' ');
  return Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 220));
}
