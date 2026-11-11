import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { Catalog } from '../types';
import { LISTS, PRICES, SORTS, browse, genreCounts, readQuery, writeQuery, type BrowseQuery } from '../lib/browse';
import { useShop } from '../state/ShopProvider';
import { GameCard } from '../components/GameCard';

export function Browse({ catalog }: { catalog: Catalog }) {
  const [params, setParams] = useSearchParams();
  const { wishlist } = useShop();
  const query = readQuery(params);

  const results = useMemo(() => browse(catalog, query, wishlist), [catalog, params, wishlist]); // eslint-disable-line react-hooks/exhaustive-deps
  const genres = useMemo(() => genreCounts(Object.values(catalog.games)), [catalog]);

  const update = (patch: Partial<BrowseQuery>) => setParams(writeQuery({ ...query, ...patch }), { replace: true });
  const filtered = query.q || query.genre || query.price !== 'any' || query.list;

  const title = query.list ? LISTS[query.list] : query.genre || 'All games';

  return (
    <div className="page browse">
      <aside className="filters" aria-label="Filters">
        <details open>
          <summary>Filters</summary>

          <fieldset>
            <legend>Collection</legend>
            <select value={query.list} onChange={(e) => update({ list: e.target.value as BrowseQuery['list'] })}>
              <option value="">Everything</option>
              {Object.entries(LISTS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            {Object.entries(PRICES).map(([key, label]) => (
              <label key={key} className="radio">
                <input
                  type="radio"
                  name="price"
                  checked={query.price === key}
                  onChange={() => update({ price: key as BrowseQuery['price'] })}
                />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Genre</legend>
            <div className="genre-list">
              <button type="button" className={!query.genre ? 'is-active' : ''} onClick={() => update({ genre: '' })}>
                All genres
              </button>
              {genres.map(([genre, count]) => (
                <button
                  key={genre}
                  type="button"
                  className={query.genre === genre ? 'is-active' : ''}
                  aria-pressed={query.genre === genre}
                  onClick={() => update({ genre: query.genre === genre ? '' : genre })}
                >
                  {genre}
                  <span>{count}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </details>
      </aside>

      <section className="results" aria-labelledby="results-title">
        <header className="results__head">
          <div>
            <h1 id="results-title">{title}</h1>
            <p className="muted" role="status">
              {results.length} {results.length === 1 ? 'game' : 'games'}
              {query.q && (
                <>
                  {' '}
                  matching “{query.q}”
                </>
              )}
              {filtered && (
                <>
                  {' · '}
                  <Link className="text-link" to="/browse">
                    Clear filters
                  </Link>
                </>
              )}
            </p>
          </div>
          <label className="sort">
            Sort by
            <select value={query.sort} onChange={(e) => update({ sort: e.target.value as BrowseQuery['sort'] })}>
              {Object.entries(SORTS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </header>

        {results.length ? (
          <div className="grid">
            {results.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>
              {query.list === 'wishlist' && !wishlist.length
                ? 'Your wishlist is empty. Tap the heart on any game to save it here.'
                : 'Nothing matches those filters.'}
            </p>
            <Link className="button" to="/browse">
              See all games
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
