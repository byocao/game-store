import type { Catalog, Game, SectionKey } from '../types';
import { priceOf } from './format';

export const SORTS = {
  popular: 'Most recommended',
  discount: 'Biggest discount',
  priceAsc: 'Price: low to high',
  priceDesc: 'Price: high to low',
  metacritic: 'Metacritic score',
  name: 'Name',
} as const;
export type Sort = keyof typeof SORTS;

export const PRICES = {
  any: 'Any price',
  free: 'Free to play',
  under10: 'Under $10',
  under30: 'Under $30',
  sale: 'On sale',
} as const;
export type PriceFilter = keyof typeof PRICES;

export const LISTS: Record<SectionKey | 'wishlist', string> = {
  topSellers: 'Top sellers',
  specials: 'On sale',
  newReleases: 'New releases',
  comingSoon: 'Coming soon',
  popular: 'All-time favourites',
  wishlist: 'Your wishlist',
};
export type ListKey = keyof typeof LISTS;

export interface BrowseQuery {
  q: string;
  genre: string;
  price: PriceFilter;
  sort: Sort;
  list: ListKey | '';
}

const isKey = <T extends object>(obj: T, key: string | null): key is Extract<keyof T, string> =>
  key !== null && Object.prototype.hasOwnProperty.call(obj, key);

export function readQuery(params: URLSearchParams): BrowseQuery {
  const price = params.get('price');
  const sort = params.get('sort');
  const list = params.get('list');
  return {
    q: params.get('q') ?? '',
    genre: params.get('genre') ?? '',
    price: isKey(PRICES, price) ? price : 'any',
    sort: isKey(SORTS, sort) ? sort : 'popular',
    list: isKey(LISTS, list) ? list : '',
  };
}

/** Only the non-default values, so URLs stay short. */
export function writeQuery(query: BrowseQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.genre) params.set('genre', query.genre);
  if (query.price !== 'any') params.set('price', query.price);
  if (query.sort !== 'popular') params.set('sort', query.sort);
  if (query.list) params.set('list', query.list);
  return params;
}

const normalize = (s: string) =>
  s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function matchesPrice(game: Game, price: PriceFilter): boolean {
  switch (price) {
    case 'any':
      return true;
    case 'free':
      return game.isFree;
    case 'under10':
      return game.price !== null && priceOf(game) < 1000;
    case 'under30':
      return game.price !== null && priceOf(game) < 3000;
    case 'sale':
      return (game.price?.discount ?? 0) > 0;
  }
}

const compare: Record<Sort, (a: Game, b: Game) => number> = {
  popular: (a, b) => b.recommendations - a.recommendations,
  discount: (a, b) => (b.price?.discount ?? 0) - (a.price?.discount ?? 0) || b.recommendations - a.recommendations,
  priceAsc: (a, b) => priceOf(a) - priceOf(b),
  priceDesc: (a, b) => priceOf(b) - priceOf(a),
  metacritic: (a, b) => (b.metacritic ?? -1) - (a.metacritic ?? -1),
  name: (a, b) => a.name.localeCompare(b.name),
};

export function browse(catalog: Catalog, query: BrowseQuery, wishlist: number[] = []): Game[] {
  let pool: Game[];
  if (query.list === 'wishlist') pool = wishlist.map((id) => catalog.games[id]).filter(Boolean);
  else if (query.list) pool = catalog.sections[query.list].map((id) => catalog.games[id]);
  else pool = Object.values(catalog.games);

  const words = normalize(query.q).split(' ').filter(Boolean);
  const results = pool.filter((game) => {
    if (query.genre && !game.genres.includes(query.genre)) return false;
    if (!matchesPrice(game, query.price)) return false;
    if (words.length) {
      const haystack = normalize([game.name, ...game.developers, ...game.publishers, ...game.genres].join(' '));
      if (!words.every((w) => haystack.includes(w))) return false;
    }
    return true;
  });
  return results.sort(compare[query.sort]);
}

/** Genres ordered by how many games have them. */
export function genreCounts(games: Game[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const game of games) for (const g of game.genres) counts.set(g, (counts.get(g) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Games that share the most genres with this one. */
export function similarGames(catalog: Catalog, game: Game, limit = 10): Game[] {
  return Object.values(catalog.games)
    .filter((other) => other.id !== game.id)
    .map((other) => ({ other, score: other.genres.filter((g) => game.genres.includes(g)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.other.recommendations - a.other.recommendations)
    .slice(0, limit)
    .map(({ other }) => other);
}
