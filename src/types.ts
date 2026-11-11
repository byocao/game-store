export interface Price {
  /** US cents before discount */
  initial: number;
  /** US cents the game sells for today */
  final: number;
  discount: number;
}

export interface Requirement {
  label: string;
  value: string;
}

export interface Game {
  id: number;
  name: string;
  shortDescription: string;
  about: string[];
  headerImage: string;
  background: string | null;
  screenshots: { thumb: string; full: string }[];
  genres: string[];
  features: string[];
  developers: string[];
  publishers: string[];
  releaseDate: string;
  comingSoon: boolean;
  isFree: boolean;
  price: Price | null;
  platforms: { windows: boolean; mac: boolean; linux: boolean };
  metacritic: number | null;
  recommendations: number;
  requiredAge: number;
  website: string | null;
  requirements: Requirement[];
}

export type SectionKey = 'topSellers' | 'specials' | 'newReleases' | 'comingSoon' | 'popular';

export interface Catalog {
  generatedAt: string;
  currency: 'USD';
  sections: Record<SectionKey, number[]>;
  games: Record<string, Game>;
}
