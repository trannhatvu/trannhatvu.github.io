import { getCollection, type CollectionEntry } from 'astro:content';

export const site = {
  name: 'Raini’s Petit Coin',
  title: 'A little corner for curious minds',
  url: 'https://trannhatvu.github.io',
  // Set a local image path, such as /images/portrait.webp, when your photo is ready.
  portrait: null as string | null,
};

export const languages = ['en', 'vi'] as const;
export type Language = (typeof languages)[number];
export type Entry = CollectionEntry<'writing'>;

export const text = {
  en: {
    writing: 'Writing', notes: 'Notes', about: 'About', search: 'Search',
    skip: 'Skip to content', theme: 'Switch color theme', language: 'Read in Vietnamese',
    eyebrow: 'CODE / TECH / LIFE ABROAD',
    intro: 'Code, curiosity,\nand life abroad.',
    description: 'A personal blog about code, technology, everyday discoveries, and life abroad.',
    browse: 'Explore the writing', latest: 'Latest writing', allWriting: 'All writing',
    recentNotes: 'Short notes', allNotes: 'All notes', topics: 'Explore a topic',
    article: 'Article', tutorial: 'Tutorial', note: 'Note', minute: 'min read',
    back: 'Back to writing', toc: 'On this page', translated: 'Đọc bằng tiếng Việt',
    starter: 'Starter content — adapt this article before making it your own.',
    empty: 'Nothing here yet. Good notes take a little time.',
    footer: 'Built to be read. Kept deliberately simple.',
    searchDescription: 'Find a command, a concept, or your next rabbit hole.',
    searchLabel: 'Search the notebook', searchPlaceholder: 'Try “pipeline” or “Bash”…',
    searchHint: 'Search the published articles in English. No tracking. No external service.',
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
    aboutBody: 'Raini’s Petit Coin is where I write about code, technology, life abroad, and anything else that sparks my curiosity.',
    aboutSecond: 'Expect practical tech notes, discoveries worth keeping, and stories from living abroad. Posts may be in English or Vietnamese.',
    aboutPlaceholder: 'Add your portrait',
    aboutInstruction: 'The initial is a placeholder until you add a portrait.',
    photo: 'Portrait placeholder',
    notFound: 'This page wandered off.',
  },
  vi: {
    writing: 'Bài viết', notes: 'Ghi chú', about: 'Giới thiệu', search: 'Tìm kiếm',
    skip: 'Chuyển đến nội dung', theme: 'Đổi giao diện sáng tối', language: 'Read in English',
    eyebrow: 'LẬP TRÌNH / CÔNG NGHỆ / CUỘC SỐNG XA NHÀ',
    intro: 'Lập trình, tò mò,\nvà cuộc sống xa nhà.',
    description: 'Blog cá nhân về lập trình, công nghệ, những khám phá thường ngày và cuộc sống xa nhà.',
    browse: 'Khám phá bài viết', latest: 'Bài viết mới', allWriting: 'Tất cả bài viết',
    recentNotes: 'Ghi chú ngắn', allNotes: 'Tất cả ghi chú', topics: 'Khám phá chủ đề',
    article: 'Bài viết', tutorial: 'Hướng dẫn', note: 'Ghi chú', minute: 'phút đọc',
    back: 'Về danh sách bài viết', toc: 'Trong bài này', translated: 'Read in English',
    starter: 'Nội dung mẫu — hãy chỉnh sửa trước khi sử dụng làm bài viết của bạn.',
    empty: 'Chưa có nội dung. Ghi chú hay cần một chút thời gian.',
    footer: 'Ưu tiên việc đọc. Chủ động giữ mọi thứ đơn giản.',
    searchDescription: 'Tìm một câu lệnh, một khái niệm hoặc điều bạn muốn khám phá.',
    searchLabel: 'Tìm trong sổ tay', searchPlaceholder: 'Thử “pipeline” hoặc “Bash”…',
    searchHint: 'Tìm trong các bài viết tiếng Việt. Không theo dõi. Không dùng dịch vụ bên ngoài.',
    searchLoading: 'Đang tìm…', searchEmpty: 'Không có kết quả. Hãy thử từ khác.',
    searchError: 'Không thể tải tìm kiếm. Vui lòng tải lại trang và thử lại.',
    searchDev: 'Tìm kiếm hoạt động trong bản production. Chạy npm run build, sau đó npm run preview.',
    results: 'kết quả', copy: 'Sao chép', copied: 'Đã sao chép', copyError: 'Sao chép thất bại',
    diagramError: 'Không thể hiển thị sơ đồ. Mã nguồn được giữ lại bên dưới.',
    notesDescription: 'Những khám phá nhỏ đáng lưu lại. Ngắn gọn, nhưng vẫn đầy tò mò.',
    writingDescription: 'Những câu chuyện và ý tưởng về lập trình, công nghệ và cuộc sống ngoài màn hình.',
    tagged: 'Chủ đề', allTopics: 'Tất cả chủ đề',
    aboutTitle: 'Một góc nhỏ trong thế giới của mình.',
    aboutLead: 'Nơi chia sẻ những điều mình đang học, xây dựng và quan sát trên hành trình.',
    aboutBody: 'Raini’s Petit Coin là nơi mình viết về lập trình, công nghệ, cuộc sống xa nhà và bất cứ điều gì khơi gợi sự tò mò.',
    aboutSecond: 'Bạn sẽ tìm thấy ghi chú công nghệ, những khám phá đáng lưu lại và câu chuyện về cuộc sống xa nhà. Bài viết có thể bằng tiếng Việt hoặc tiếng Anh.',
    aboutPlaceholder: 'Thêm ảnh chân dung',
    aboutInstruction: 'Chữ cái ban đầu chỉ là nội dung tạm cho đến khi bạn thêm ảnh chân dung.',
    photo: 'Vị trí ảnh chân dung',
    notFound: 'Không tìm thấy trang này.',
  },
} satisfies Record<Language, Record<string, string>>;

export async function published(lang?: Language) {
  const entries = await getCollection('writing', ({ data }) => !data.draft && (!lang || data.lang === lang));
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export function entryUrl(entry: Entry) {
  const slug = entry.id.split('/').at(-1);
  return `/${entry.data.lang}/${entry.data.kind === 'note' ? 'notes' : 'writing'}/${slug}/`;
}

export function tagSlug(tag: string) {
  return tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function dateLabel(date: Date, lang: Language) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'vi-VN', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

export function readingTime(entry: Entry) {
  const body = (entry.body ?? '').replace(/<\/?[A-Za-z][^>]*>/g, ' ').replace(/&(?:#\d+|#x[\da-f]+|[a-z]+);/gi, ' ');
  return Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 220));
}
