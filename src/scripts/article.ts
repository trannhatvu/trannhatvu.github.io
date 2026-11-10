export function setupArticle() {
  const article = document.querySelector<HTMLElement>('.article-shell');
  if (!article) throw new Error('Article markup is missing.');
  const status = article.querySelector<HTMLElement>('.copy-status');
  for (const pre of article.querySelectorAll<HTMLPreElement>('pre')) {
    const code = pre.querySelector('code');
    if (!code || code.classList.contains('language-mermaid') || pre.dataset.language === 'mermaid') continue;
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.textContent = article.dataset.copy ?? 'Copy';
    button.setAttribute('aria-label', article.dataset.copy ?? 'Copy');
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.before(wrapper);
    wrapper.append(pre, button);
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent ?? '');
        button.textContent = article.dataset.copied ?? 'Copied';
        if (status) status.textContent = article.dataset.copied ?? 'Copied';
      } catch (error) {
        console.error('Code could not be copied.', error);
        button.textContent = article.dataset.copyError ?? 'Copy failed';
        if (status) status.textContent = article.dataset.copyError ?? 'Copy failed';
      }
      setTimeout(() => { button.textContent = article.dataset.copy ?? 'Copy'; }, 2000);
    });
  }
  const diagrams = article.querySelectorAll<HTMLElement>('code.language-mermaid, pre[data-language="mermaid"] code');
  if (diagrams.length) void renderDiagrams(diagrams, article);
}

async function renderDiagrams(diagrams: NodeListOf<HTMLElement>, article: HTMLElement) {
  try {
    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral', suppressErrorRendering: true });
    for (const [index, code] of Array.from(diagrams).entries()) {
      const { svg } = await mermaid.render(`notebook-diagram-${index}`, code.textContent ?? '');
      const figure = document.createElement('figure');
      figure.className = 'diagram';
      figure.innerHTML = svg;
      code.closest('pre')?.replaceWith(figure);
    }
  } catch (error) {
    console.error('A notebook diagram could not render.', error);
    const message = document.createElement('p');
    message.className = 'callout';
    message.setAttribute('role', 'alert');
    message.textContent = article.dataset.diagramError ?? 'The diagram could not render.';
    const remaining = Array.from(diagrams).find(code => code.closest('pre'));
    if (remaining) remaining.closest('pre')?.before(message);
    else article.querySelector('.prose')?.prepend(message);
  }
}
