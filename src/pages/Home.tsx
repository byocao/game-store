import { Link } from 'react-router';
import type { Catalog, SectionKey } from '../types';
import { LISTS, genreCounts } from '../lib/browse';
import { Hero } from '../components/Hero';
import { Rail } from '../components/Rail';

const RAILS: SectionKey[] = ['specials', 'topSellers', 'newReleases', 'popular', 'comingSoon'];

// Steam's own order is kept for these; the rest lead with the games most players recommend.
const KEEP_ORDER = new Set<SectionKey>(['topSellers', 'comingSoon']);

export function Home({ catalog }: { catalog: Catalog }) {
  const pick = (key: SectionKey) => {
    const games = catalog.sections[key].map((id) => catalog.games[id]);
    return KEEP_ORDER.has(key) ? games : games.sort((a, b) => b.recommendations - a.recommendations);
  };

  // Lead with the deepest discounts on well-liked games, then fill up with top sellers.
  const featured = [...pick('specials')]
    .filter((g) => g.screenshots.length)
    .sort((a, b) => b.recommendations - a.recommendations)
    .slice(0, 3);
  for (const g of pick('topSellers').concat(pick('popular'))) {
    if (featured.length >= 6) break;
    if (!featured.includes(g) && g.screenshots.length) featured.push(g);
  }

  const genres = genreCounts(Object.values(catalog.games)).slice(0, 12);

  return (
    <div className="page">
      <Hero games={featured} />

      <nav className="chips" aria-label="Genres">
        {genres.map(([genre, count]) => (
          <Link key={genre} className="chip" to={`/browse?genre=${encodeURIComponent(genre)}`}>
            {genre} <span>{count}</span>
          </Link>
        ))}
      </nav>

      {RAILS.map((key) => (
        <Rail key={key} title={LISTS[key]} games={pick(key)} moreHref={`/browse?list=${key}`} />
      ))}
    </div>
  );
}
