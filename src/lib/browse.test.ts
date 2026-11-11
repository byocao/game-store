import { describe, expect, it } from 'vitest';
import type { Catalog, Game } from '../types';
import { browse, genreCounts, readQuery, similarGames, writeQuery, type BrowseQuery } from './browse';

const game = (id: number, overrides: Partial<Game> = {}): Game => ({
  id,
  name: `Game ${id}`,
  shortDescription: '',
  about: [],
  headerImage: '',
  background: null,
  screenshots: [],
  genres: [],
  features: [],
  developers: [],
  publishers: [],
  releaseDate: '',
  comingSoon: false,
  isFree: false,
  price: { initial: 2000, final: 2000, discount: 0 },
  platforms: { windows: true, mac: false, linux: false },
  metacritic: null,
  recommendations: 0,
  requiredAge: 0,
  website: null,
  requirements: [],
  ...overrides,
});

const games = [
  game(1, { name: 'Hollow Knight', genres: ['Action', 'Indie'], price: { initial: 1499, final: 749, discount: 50 }, recommendations: 300 }),
  game(2, { name: 'Counter-Strike 2', genres: ['Action'], isFree: true, price: null, recommendations: 900 }),
  game(3, { name: 'Pokémon-like Café', genres: ['Indie', 'Simulation'], developers: ['Tiny Studio'], recommendations: 10, metacritic: 88 }),
  game(4, { name: 'Space Sim', genres: ['Simulation'], price: { initial: 5999, final: 5999, discount: 0 }, recommendations: 50 }),
];

const catalog: Catalog = {
  generatedAt: '2026-01-01T00:00:00Z',
  currency: 'USD',
  sections: { topSellers: [4, 1], specials: [1], newReleases: [], comingSoon: [], popular: [2] },
  games: Object.fromEntries(games.map((g) => [g.id, g])),
};

const q = (patch: Partial<BrowseQuery> = {}): BrowseQuery => ({ ...readQuery(new URLSearchParams()), ...patch });
const names = (list: Game[]) => list.map((g) => g.name);

describe('browse', () => {
  it('sorts by recommendations by default', () => {
    expect(names(browse(catalog, q()))).toEqual(['Counter-Strike 2', 'Hollow Knight', 'Space Sim', 'Pokémon-like Café']);
  });

  it('searches names, studios and genres, ignoring accents and case', () => {
    expect(names(browse(catalog, q({ q: 'pokemon' })))).toEqual(['Pokémon-like Café']);
    expect(names(browse(catalog, q({ q: 'tiny studio' })))).toEqual(['Pokémon-like Café']);
    expect(names(browse(catalog, q({ q: 'COUNTER strike' })))).toEqual(['Counter-Strike 2']);
  });

  it('filters by genre and price', () => {
    expect(names(browse(catalog, q({ genre: 'Indie' })))).toEqual(['Hollow Knight', 'Pokémon-like Café']);
    expect(names(browse(catalog, q({ price: 'free' })))).toEqual(['Counter-Strike 2']);
    expect(names(browse(catalog, q({ price: 'sale' })))).toEqual(['Hollow Knight']);
    expect(names(browse(catalog, q({ price: 'under10' })))).toEqual(['Hollow Knight']);
  });

  it('sorts by price both ways, free games first when ascending', () => {
    expect(names(browse(catalog, q({ sort: 'priceAsc' })))[0]).toBe('Counter-Strike 2');
    expect(names(browse(catalog, q({ sort: 'priceDesc' })))[0]).toBe('Space Sim');
  });

  it('limits to a store section or the wishlist', () => {
    expect(names(browse(catalog, q({ list: 'topSellers' })))).toEqual(['Hollow Knight', 'Space Sim']);
    expect(names(browse(catalog, q({ list: 'wishlist' }), [3, 99]))).toEqual(['Pokémon-like Café']);
  });
});

describe('query string', () => {
  it('falls back to defaults for unknown values', () => {
    expect(readQuery(new URLSearchParams('sort=hack&price=cheap&list=nope'))).toEqual(q());
  });

  it('round-trips and leaves defaults out of the URL', () => {
    const query = q({ q: 'knight', genre: 'Indie', sort: 'discount' });
    expect(writeQuery(query).toString()).toBe('q=knight&genre=Indie&sort=discount');
    expect(readQuery(writeQuery(query))).toEqual(query);
  });
});

describe('genres and similar games', () => {
  it('counts genres, most common first', () => {
    expect(genreCounts(games)).toEqual([
      ['Action', 2],
      ['Indie', 2],
      ['Simulation', 2],
    ]);
  });

  it('suggests games sharing the most genres', () => {
    expect(names(similarGames(catalog, games[2]))).toEqual(['Hollow Knight', 'Space Sim']);
  });
});
