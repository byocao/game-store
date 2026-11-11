import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Game } from '../types';
import { isBuyable } from '../lib/format';
import { useShop } from '../state/ShopProvider';
import { PriceTag } from './PriceTag';

const INTERVAL_MS = 7000;

export function Hero({ games }: { games: Game[] }) {
  const shop = useShop();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduced || games.length < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % games.length), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [index, paused, games.length]);

  const game = games[index];
  if (!game) return null;
  const inCart = shop.cart.includes(game.id);
  const backdrop = game.screenshots[0]?.full ?? game.background ?? game.headerImage;

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured games"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <img key={game.id} className="hero__backdrop" src={backdrop} alt="" />
      <div className="hero__content" aria-live={paused ? 'polite' : 'off'}>
        <p className="eyebrow">{game.price?.discount ? 'On sale now' : 'Featured'}</p>
        <h1>{game.name}</h1>
        <p className="hero__blurb">{game.shortDescription}</p>
        <div className="hero__actions">
          <PriceTag game={game} size="lg" />
          {isBuyable(game) && (
            <button
              type="button"
              className="button"
              onClick={() => (inCart ? shop.setCartOpen(true) : shop.add(game.id))}
            >
              {inCart ? 'In cart' : 'Add to cart'}
            </button>
          )}
          <Link className="button button--ghost" to={`/game/${game.id}`}>
            View details
          </Link>
        </div>
      </div>
      <div className="hero__dots" role="tablist" aria-label="Choose featured game">
        {games.map((g, i) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={g.name}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
