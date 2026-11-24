import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const baseHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
  console.error('[prerender] dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

const ROUTES = [
  {
    path: '/',
    title: 'Tatkhalsa Pothi Sahib – Sundar Gutka, Sehaj Paath & Gurbani Searcher',
    description:
      '100% Free Seva public-domain Unicode Gurmukhi Pothi Sahib, Sundar Gutka across 15 isolated Sampardai Maryadas, Sehaj Paath Reader, Presenter Mode, and self-contained Gurbani Searcher by Tatkhalsa Foundation.',
    canonical: 'https://pothi.tatkhalsa.in/',
    heading: 'Tatkhalsa Pothi Sahib — 15 Sampardai Pothis Vault',
    summary:
      'Read Nitnem Sundar Gutka (beginning with Japneesan) across 15 strictly isolated Sampardai Maryadas, track independent Sehaj Paath across Sri Guru Granth Sahib Ji, Sri Guru Dasam Granth Sahib Ji, and Sri Guru Sarabloh Granth Sahib Ji, and search public-domain Unicode Gurmukhi instantly.',
  },
  {
    path: '/searcher',
    title: 'Gurbani Searcher – First-Letter Gurmukhi & Five Granths | Tatkhalsa Pothi Sahib',
    description:
      'Self-contained client-side Gurbani Searcher supporting Gurmukhi first-letter (Akhar), full-word Gurmukhi, algorithmic Romanized first-letter & phonetic search, and direct Ang jump across all Five Granths.',
    canonical: 'https://pothi.tatkhalsa.in/searcher',
    heading: 'Gurbani Searcher — Five Granth Sources & Nitnem Baanis',
    summary:
      'Search Sri Guru Granth Sahib Ji (SGGSJ), Sri Guru Dasam Granth Sahib Ji (SGDGSJ), Sri Guru Sarabloh Granth Sahib Ji (SGSGSJ), Bhai Gurdas Ji Vaaran, Bhai Nand Lal Ji, and Sundar Gutka Baanis locally from clean public-domain Unicode Gurmukhi.',
  },
  {
    path: '/gutka',
    title: 'Sundar Gutka & 15 Sampardai Pothis – Nitnem & Ardaas | Tatkhalsa Pothi Sahib',
    description:
      'Read the 9 Foundational Nitnem Baanis including Japneesan, Sukhmani Sahib, Asa Di Var, Aarti Sahib, and isolated Sampardai Ardaas across 15 Sampardai Maryadas without mixing traditions.',
    canonical: 'https://pothi.tatkhalsa.in/gutka',
    heading: 'Sundar Gutka — 15 Isolated Sampardai Maryadas & Nitnem Baanis',
    summary:
      'Switch cleanly between 15 isolated Sampardai Pothis including Puratan Dal Panth (Buddha Dal), Damdami Taksal, Takht Sri Hazoor Sahib, Patna Sahib, SGPC, Tarna Dal, Bidhi Chand Dal, Nirmala, Udasi, Sevapanthi, Nanaksar, Rara Sahib, AKJ, Mastuana, and Puratan Darbar Sahib Gutka.',
  },
  {
    path: '/reader',
    title: 'Sehaj Paath & Scripture Reader – Larivaar & Unicode Gurmukhi | Tatkhalsa Pothi Sahib',
    description:
      'Distraction-free public-domain Unicode Gurmukhi Scripture Reader with independent per-Granth Sehaj Paath bookmarks, Larivaar continuous script toggle, and in-house Santhya audio support.',
    canonical: 'https://pothi.tatkhalsa.in/reader',
    heading: 'Sehaj Paath & Scripture Reader — Independent Multi-Granth Bookmarks',
    summary:
      'Continue Sehaj Paath independently across Sri Guru Granth Sahib Ji (Ang 1–1430), Sri Guru Dasam Granth Sahib Ji (Ang 1–1428), Sri Guru Sarabloh Granth Sahib Ji (Ang 1–1040), Bhai Gurdas Ji Vaaran, and Bhai Nand Lal Ji in clean Noto Sans Gurmukhi.',
  },
  {
    path: '/pothi-present',
    title: 'Gurbani Presenter Mode – Full-Screen Gurdwara Projection | Tatkhalsa Pothi Sahib',
    description:
      'Clean full-screen Unicode Gurmukhi projection mode with multi-tab projector sync, Larivaar and Fullscreen keyboard shortcuts, and Multi-View Shabad Queue support.',
    canonical: 'https://pothi.tatkhalsa.in/pothi-present',
    heading: 'Tatkhalsa Pothi Sahib — Full-Screen Presenter Mode',
    summary:
      'Project Gurbani Shabads and Nitnem Baanis Tuk-by-Tuk in crisp Unicode Noto Sans Gurmukhi with real-time projector tab sync and keyboard navigation.',
  },
];

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function injectRouteMetadata(html, route) {
  const safeTitle = escapeAttr(route.title);
  const safeDesc = escapeAttr(route.description);
  const safeCanonical = escapeAttr(route.canonical);

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/i,
      `<meta name="description" content="${safeDesc}" />`,
    )
    .replace(
      /<link\s+rel="canonical"[\s\S]*?\/>/i,
      `<link rel="canonical" href="${safeCanonical}" />`,
    )
    .replace(
      /<meta\s+property="og:url"[\s\S]*?\/>/i,
      `<meta property="og:url" content="${safeCanonical}" />`,
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/>/i,
      `<meta property="og:title" content="${safeTitle}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/i,
      `<meta property="og:description" content="${safeDesc}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"[\s\S]*?\/>/i,
      `<meta name="twitter:title" content="${safeTitle}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
      `<meta name="twitter:description" content="${safeDesc}" />`,
    );

  const crawlerFallback = `
    <noscript>
      <main style="max-width:720px;margin:2rem auto;padding:1.5rem;font-family:system-ui,sans-serif;line-height:1.6;">
        <h1>${escapeAttr(route.heading)}</h1>
        <p>${escapeAttr(route.summary)}</p>
        <p lang="pa">ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥</p>
        <nav aria-label="Tatkhalsa Pothi Sahib Sections">
          <a href="/">Pothi Vault</a> ·
          <a href="/searcher">Gurbani Searcher</a> ·
          <a href="/gutka">Sundar Gutka</a> ·
          <a href="/reader">Sehaj Paath Reader</a> ·
          <a href="/pothi-present">Presenter Mode</a>
        </nav>
      </main>
    </noscript>`;

  out = out.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');
  out = out.replace('<div id="root"></div>', `<div id="root"></div>${crawlerFallback}`);
  return out;
}

for (const route of ROUTES) {
  const rendered = injectRouteMetadata(baseHtml, route);
  if (route.path === '/') {
    fs.writeFileSync(baseHtmlPath, rendered, 'utf8');
  } else {
    const dir = path.join(distDir, route.path.replace(/^\/+/, ''));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), rendered, 'utf8');
  }
}

console.log(`[prerender] Generated crawlable HTML metadata for ${ROUTES.length} routes.`);
