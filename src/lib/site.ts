import { getCollection, type CollectionEntry } from 'astro:content';

export const site = {
  name: 'Tran Nhat Vu',
  title: 'The engineering notebook',
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
    eyebrow: 'CODE / SYSTEMS / SMALL DISCOVERIES',
    intro: 'Make it work.\nUnderstand why.',
    description: 'A personal notebook on GitLab CI, scripting, and the small automations that make a difference.',
    browse: 'Explore the writing', latest: 'Latest writing', allWriting: 'All writing',
    recentNotes: 'Short notes', allNotes: 'All notes', topics: 'Explore a topic',
    tutorial: 'Tutorial', note: 'Note', minute: 'min read',
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
    writingDescription: 'Practical guides to pipelines, shell scripts, and doing less by automating more.',
    tagged: 'Filed under', allTopics: 'All topics',
    aboutTitle: 'A person behind the notes.',
    aboutLead: 'This is a place to turn technical problems into useful, repeatable explanations.',
    aboutBody: 'The notebook focuses on GitLab CI, scripting, and automation: what works, why it works, and the details that are easy to forget.',
    aboutSecond: 'Longer tutorials live in Writing. Small discoveries go into Notes. English is the default; Vietnamese translations appear when available.',
    aboutPlaceholder: 'Make this page yours',
    aboutInstruction: 'Add your own introduction and portrait before launch. The initials are a placeholder, not a finished profile.',
    photo: 'Portrait placeholder',
    notFound: 'This page wandered off.',
  },
  vi: {
    writing: 'Bài viết', notes: 'Ghi chú', about: 'Giới thiệu', search: 'Tìm kiếm',
    skip: 'Chuyển đến nội dung', theme: 'Đổi giao diện sáng tối', language: 'Read in English',
    eyebrow: 'LẬP TRÌNH / HỆ THỐNG / KHÁM PHÁ NHỎ',
    intro: 'Làm cho chạy.\nHiểu tại sao.',
    description: 'Sổ tay cá nhân về GitLab CI, viết script và những tự động hóa nhỏ tạo nên khác biệt.',
    browse: 'Khám phá bài viết', latest: 'Bài viết mới', allWriting: 'Tất cả bài viết',
    recentNotes: 'Ghi chú ngắn', allNotes: 'Tất cả ghi chú', topics: 'Khám phá chủ đề',
    tutorial: 'Hướng dẫn', note: 'Ghi chú', minute: 'phút đọc',
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
    writingDescription: 'Hướng dẫn thực tế về pipeline, shell script và tự động hóa công việc.',
    tagged: 'Chủ đề', allTopics: 'Tất cả chủ đề',
    aboutTitle: 'Người đứng sau những ghi chú.',
    aboutLead: 'Nơi biến các vấn đề kỹ thuật thành lời giải thích hữu ích và có thể áp dụng lại.',
    aboutBody: 'Sổ tay tập trung vào GitLab CI, viết script và tự động hóa: cách làm, lý do và những chi tiết dễ quên.',
    aboutSecond: 'Hướng dẫn dài nằm trong Bài viết. Khám phá nhỏ nằm trong Ghi chú. Tiếng Anh là mặc định; bản dịch tiếng Việt sẽ xuất hiện khi có.',
    aboutPlaceholder: 'Thêm dấu ấn của bạn',
    aboutInstruction: 'Hãy thêm lời giới thiệu và ảnh chân dung trước khi ra mắt. Chữ viết tắt chỉ là nội dung tạm.',
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
  return Math.max(1, Math.ceil((entry.body ?? '').split(/\s+/).length / 220));
}
