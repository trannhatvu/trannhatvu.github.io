interface SearchData {
  url: string;
  meta: { title?: string };
  excerpt: string;
}
interface SearchResult { data(): Promise<SearchData> }
interface Pagefind {
  search(query: string): Promise<{ results: SearchResult[] }>;
}

export function setupSearch() {
  const panel = document.querySelector<HTMLElement>('[data-search]');
  const input = document.querySelector<HTMLInputElement>('#search-input');
  const status = panel?.querySelector<HTMLElement>('.search-status');
  const results = panel?.querySelector<HTMLUListElement>('.search-results');
  if (!panel || !input || !status || !results) throw new Error('Search markup is incomplete.');
  let pagefind: Promise<Pagefind> | undefined;
  let generation = 0;
  let timer: ReturnType<typeof setTimeout>;

  async function search(query: string, version: number) {
    if (!panel || !status || !results) return;
    results.replaceChildren();
    if (!query) { status.textContent = ''; return; }
    if (panel.dataset.dev) { status.textContent = panel.dataset.dev; return; }
    status.textContent = panel.dataset.loading ?? '';
    try {
      const indexUrl = '/pagefind/pagefind.js';
    pagefind ??= import(/* @vite-ignore */ indexUrl).then((module: Pagefind) => module);
    const { results: searchResults } = await (await pagefind).search(query);
      const entries = await Promise.all(searchResults.slice(0, 20).map(result => result.data()));
      if (version !== generation) return;
      status.textContent = searchResults.length ? `${searchResults.length} ${panel.dataset.results}` : panel.dataset.empty ?? '';
      for (const entry of entries) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = entry.url;
        link.textContent = entry.meta.title ?? entry.url;
        const excerpt = document.createElement('p');
        // Pagefind inserts highlight markup; parse it as inert text, never page HTML.
        excerpt.textContent = new DOMParser().parseFromString(entry.excerpt, 'text/html').body.textContent;
        item.append(link, excerpt);
        results.append(item);
      }
    } catch (error) {
      console.error('Notebook search failed.', error);
      pagefind = undefined;
      if (version === generation) status.textContent = panel.dataset.error ?? '';
    }
  }

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const version = ++generation;
    timer = setTimeout(() => { void search(input.value.trim(), version); }, 180);
  });
}
