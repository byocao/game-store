import { Link } from 'react-router';
import type { Game } from '../types';
import { isBuyable } from '../lib/format';
import { useShop } from '../state/ShopProvider';
import { CartIcon, CheckIcon, HeartIcon } from './Icons';
import { PriceTag } from './PriceTag';

export function GameCard({ game }: { game: Game }) {
  const shop = useShop();
  const inCart = shop.cart.includes(game.id);
  const wished = shop.wishlist.includes(game.id);

  return (
    <article className="card">
      <Link to={`/game/${game.id}`} className="card__link">
        <img className="card__image" src={game.headerImage} alt="" width={460} height={215} loading="lazy" />
        <h3 className="card__title">{game.name}</h3>
      </Link>
      <p className="card__genres">{game.genres.slice(0, 3).join(' · ') || ' '}</p>
      <div className="card__footer">
        <PriceTag game={game} />
        <div className="card__actions">
          <button
            type="button"
            className={`icon-button${wished ? ' is-active' : ''}`}
            aria-pressed={wished}
            aria-label={wished ? `Remove ${game.name} from wishlist` : `Add ${game.name} to wishlist`}
            onClick={() => shop.toggleWish(game.id)}
          >
            <HeartIcon filled={wished} />
          </button>
          {isBuyable(game) && (
            <button
              type="button"
              className={`icon-button icon-button--solid${inCart ? ' is-done' : ''}`}
              aria-label={inCart ? `${game.name} is in your cart` : `Add ${game.name} to cart`}
              onClick={() => (inCart ? shop.setCartOpen(true) : shop.add(game.id))}
            >
              {inCart ? <CheckIcon /> : <CartIcon />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
