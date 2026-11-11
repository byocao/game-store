import type { Game } from '../types';
import { formatCents, priceLabel } from '../lib/format';

export function PriceTag({ game, size = 'md' }: { game: Game; size?: 'md' | 'lg' }) {
  const discount = game.price?.discount ?? 0;
  if (!discount || !game.price) {
    return <span className={`price price--${size}`}>{priceLabel(game)}</span>;
  }
  return (
    <span className={`price price--${size}`}>
      <span className="price__badge">-{discount}%</span>
      <span className="price__was">
        <span className="sr-only">Was </span>
        {formatCents(game.price.initial)}
      </span>
      <span className="price__now">
        <span className="sr-only">now </span>
        {formatCents(game.price.final)}
      </span>
    </span>
  );
}
