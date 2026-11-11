import type { Game } from '../types';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatCents = (cents: number) => usd.format(cents / 100);

/** What the game costs today in cents. Free and unpriced games count as 0. */
export const priceOf = (game: Game) => (game.isFree || !game.price ? 0 : game.price.final);

export function priceLabel(game: Game): string {
  if (game.isFree) return 'Free to play';
  if (game.price) return formatCents(game.price.final);
  return game.comingSoon ? 'Coming soon' : 'Not for sale';
}

/** Whether the game can go in the cart. */
export const isBuyable = (game: Game) => !game.isFree && game.price !== null;

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
export const formatCount = (n: number) => compact.format(n);

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function timeAgo(iso: string, now = Date.now()): string {
  const minutes = Math.round((new Date(iso).getTime() - now) / 60_000);
  if (Math.abs(minutes) < 60) return relative.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 48) return relative.format(hours, 'hour');
  return relative.format(Math.round(hours / 24), 'day');
}
