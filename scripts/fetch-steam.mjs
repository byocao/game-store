// Builds public/data/catalog.json from the public Steam Store API.
//
//   node scripts/fetch-steam.mjs
//
// The store pages run on whatever this script last wrote, so the site never calls Steam from the browser.
// If Steam is unreachable the existing catalog is left as it is and the script exits with an error.

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../public/data/catalog.json', import.meta.url));
const STORE = 'https://store.steampowered.com/api';
const REGION = { cc: 'us', l: 'english' };
const DELAY_MS = 1300; // Steam allows roughly 200 store requests per 5 minutes
const MAX_SCREENSHOTS = 8;

// Well-known games that are always in the catalog, so it never shrinks to just what's on sale today.
const STAPLES = [
  730, 570, 1091500, 1245620, 292030, 1086940, 271590, 1174180, 413150, 105600, 1145360, 367520, 892970,
  2050650, 990080, 1593500, 578080, 252490, 1172470, 359550, 814380, 374320, 1172620, 548430, 2379780,
  1868140, 553850, 2358720, 1623730, 230410, 1966720, 294100, 1794680, 489830, 377160, 268910, 504230,
  646570, 281990, 394360, 255710, 1145350, 427520, 1426210, 1551360, 2246340, 582010, 1817070,
];

const SECTIONS = {
  topSellers: 'top_sellers',
  specials: 'specials',
  newReleases: 'new_releases',
  comingSoon: 'coming_soon',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(path, params, attempt = 1) {
  const url = `${STORE}/${path}?${new URLSearchParams({ ...REGION, ...params })}`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (res.status === 429 && attempt <= 4) {
    const wait = 30_000 * attempt;
    console.warn(`  rate limited, waiting ${wait / 1000}s`);
    await sleep(wait);
    return getJson(path, params, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', reg: '®', trade: '™', copy: '©' };

function decode(text) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}

/** Steam descriptions are HTML full of images and video. Keep the words, as paragraphs. */
export function htmlToParagraphs(html, maxChars = 2400) {
  if (!html) return [];
  const text = decode(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|h\d|li|div|ul)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, ''),
  );
  const paragraphs = [];
  let length = 0;
  for (const raw of text.split(/\n+/)) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line) continue;
    if (length + line.length > maxChars) {
      // Cut an over-long paragraph at the last full sentence that fits, rather than dropping it.
      const room = line.slice(0, maxChars - length);
      const end = room.lastIndexOf('. ');
      if (end > 120) paragraphs.push(room.slice(0, end + 1));
      break;
    }
    paragraphs.push(line);
    length += line.length;
  }
  return paragraphs;
}

/** "<strong>OS:</strong> Windows 10" lines → [{ label: 'OS', value: 'Windows 10' }] */
export function parseRequirements(html) {
  return htmlToParagraphs(html, 1200)
    .map((line) => line.replace(/^•\s*/, ''))
    .filter((line) => !/:$/.test(line)) // headings like "Minimum:" or labels Steam left empty
    .map((line) => {
      const match = line.match(/^([^:]{2,30}):\s*(.+)$/);
      return match ? { label: match[1], value: match[2] } : { label: '', value: line };
    });
}

function toGame(d) {
  const price = d.price_overview
    ? { initial: d.price_overview.initial, final: d.price_overview.final, discount: d.price_overview.discount_percent }
    : null;
  return {
    id: d.steam_appid,
    name: d.name,
    shortDescription: decode(d.short_description ?? ''),
    // Some pages put only images in "about"; the words are then in the detailed description.
    about: [d.about_the_game, d.detailed_description].map((html) => htmlToParagraphs(html)).find((p) => p.length) ?? [],
    headerImage: d.header_image,
    background: d.background_raw ?? d.background ?? null,
    screenshots: (d.screenshots ?? []).slice(0, MAX_SCREENSHOTS).map((s) => ({ thumb: s.path_thumbnail, full: s.path_full })),
    genres: (d.genres ?? []).map((g) => g.description),
    features: (d.categories ?? []).map((c) => c.description).slice(0, 8),
    developers: d.developers ?? [],
    publishers: d.publishers ?? [],
    releaseDate: d.release_date?.date ?? '',
    comingSoon: Boolean(d.release_date?.coming_soon),
    isFree: Boolean(d.is_free),
    price,
    platforms: d.platforms ?? { windows: true, mac: false, linux: false },
    metacritic: d.metacritic?.score ?? null,
    recommendations: d.recommendations?.total ?? 0,
    requiredAge: Number(d.required_age) || 0,
    website: d.website || null,
    requirements: parseRequirements(d.pc_requirements?.minimum),
  };
}

async function main() {
  console.log('Fetching featured lists…');
  const featured = await getJson('featuredcategories', {});
  const sections = {};
  for (const [key, steamKey] of Object.entries(SECTIONS)) {
    sections[key] = [...new Set((featured[steamKey]?.items ?? []).filter((i) => i.type === 0).map((i) => i.id))];
  }

  const ids = [...new Set([...Object.values(sections).flat(), ...STAPLES])];
  console.log(`Fetching details for ${ids.length} apps…`);

  const games = {};
  for (const [i, id] of ids.entries()) {
    await sleep(DELAY_MS);
    try {
      const body = await getJson('appdetails', { appids: String(id) });
      const entry = body?.[id];
      if (!entry?.success || entry.data?.type !== 'game') {
        console.log(`  [${i + 1}/${ids.length}] ${id}: skipped (not a game or not sold in this region)`);
        continue;
      }
      games[id] = toGame(entry.data);
      console.log(`  [${i + 1}/${ids.length}] ${games[id].name}`);
    } catch (err) {
      console.warn(`  [${i + 1}/${ids.length}] ${id}: ${err.message}`);
    }
  }

  const count = Object.keys(games).length;
  if (count < 20) throw new Error(`Only ${count} games came back; keeping the previous catalog.`);

  for (const key of Object.keys(sections)) sections[key] = sections[key].filter((id) => games[id]);
  sections.popular = STAPLES.filter((id) => games[id]);

  const catalog = { generatedAt: new Date().toISOString(), currency: 'USD', sections, games };
  const json = JSON.stringify(catalog);
  await writeFile(OUT, json);
  console.log(`Wrote ${count} games to public/data/catalog.json (${(json.length / 1024).toFixed(0)} KB).`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
