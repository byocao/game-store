import { useRef } from 'react';
import { Link } from 'react-router';
import type { Game } from '../types';
import { GameCard } from './GameCard';
import { ChevronIcon } from './Icons';

/** A titled, horizontally scrolling row of game cards. */
export function Rail({ title, games, moreHref }: { title: string; games: Game[]; moreHref?: string }) {
  const track = useRef<HTMLDivElement>(null);
  if (!games.length) return null;

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="rail" aria-label={title}>
      <header className="rail__head">
        <h2>{title}</h2>
        <div className="rail__controls">
          {moreHref && (
            <Link className="text-link" to={moreHref}>
              See all
            </Link>
          )}
          <button type="button" className="icon-button" aria-label={`Scroll ${title} left`} onClick={() => scroll(-1)}>
            <ChevronIcon dir="left" />
          </button>
          <button type="button" className="icon-button" aria-label={`Scroll ${title} right`} onClick={() => scroll(1)}>
            <ChevronIcon />
          </button>
        </div>
      </header>
      <div className="rail__track" ref={track}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
