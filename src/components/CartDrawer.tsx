import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { Catalog } from '../types';
import { formatCents } from '../lib/format';
import { useShop } from '../state/ShopProvider';
import { CloseIcon, ExternalIcon } from './Icons';

export function CartDrawer({ catalog }: { catalog: Catalog }) {
  const shop = useShop();
  const panel = useRef<HTMLDivElement>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const { cartOpen, setCartOpen } = shop;

  const items = shop.cart.map((id) => catalog.games[id]).filter(Boolean);
  const total = items.reduce((sum, g) => sum + (g.price?.final ?? 0), 0);
  const full = items.reduce((sum, g) => sum + (g.price?.initial ?? 0), 0);

  useEffect(() => {
    if (!cartOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      setCheckingOut(false);
      previous?.focus();
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="drawer" onClick={(e) => e.target === e.currentTarget && setCartOpen(false)}>
      <div className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabIndex={-1} ref={panel}>
        <header className="drawer__head">
          <h2 id="cart-title">{checkingOut ? 'Checkout' : `Your cart (${items.length})`}</h2>
          <button type="button" className="icon-button" aria-label="Close cart" onClick={() => setCartOpen(false)}>
            <CloseIcon />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Your cart is empty.</p>
            <Link className="button" to="/browse" onClick={() => setCartOpen(false)}>
              Browse games
            </Link>
          </div>
        ) : checkingOut ? (
          <div className="drawer__body">
            <p className="note">
              This store is a portfolio project, so it doesn't take payments. Each game below opens on Steam, where you
              can buy it for real.
            </p>
            <ul className="checkout-list">
              {items.map((game) => (
                <li key={game.id}>
                  <a href={`https://store.steampowered.com/app/${game.id}`} target="_blank" rel="noreferrer">
                    {game.name}
                    <ExternalIcon width={16} height={16} />
                  </a>
                  <span>{formatCents(game.price?.final ?? 0)}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="button button--ghost" onClick={() => setCheckingOut(false)}>
              Back to cart
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer__body cart-list">
              {items.map((game) => (
                <li key={game.id} className="cart-item">
                  <img src={game.headerImage} alt="" width={120} height={56} />
                  <div>
                    <Link to={`/game/${game.id}`} onClick={() => setCartOpen(false)}>
                      {game.name}
                    </Link>
                    <button type="button" className="text-button" onClick={() => shop.remove(game.id)}>
                      Remove
                    </button>
                  </div>
                  <span className="cart-item__price">{formatCents(game.price?.final ?? 0)}</span>
                </li>
              ))}
            </ul>
            <footer className="drawer__foot">
              {full > total && (
                <p className="drawer__row drawer__row--muted">
                  <span>You save</span>
                  <span>{formatCents(full - total)}</span>
                </p>
              )}
              <p className="drawer__row">
                <span>Total</span>
                <strong>{formatCents(total)}</strong>
              </p>
              <button type="button" className="button button--block" onClick={() => setCheckingOut(true)}>
                Checkout
              </button>
              <button type="button" className="text-button" onClick={shop.clearCart}>
                Clear cart
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
