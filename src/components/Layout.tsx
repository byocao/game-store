import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router';
import type { Catalog } from '../types';
import { timeAgo } from '../lib/format';
import { useShop } from '../state/ShopProvider';
import { CartDrawer } from './CartDrawer';
import { CartIcon, SearchIcon } from './Icons';

export function Layout({ catalog }: { catalog: Catalog }) {
  const shop = useShop();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  // Keep the box in step with the URL when it changes elsewhere (back button, "clear filters").
  const urlQuery = pathname === '/browse' ? (params.get('q') ?? '') : '';
  const [search, setSearch] = useState(urlQuery);
  const [seenQuery, setSeenQuery] = useState(urlQuery);
  if (seenQuery !== urlQuery) {
    setSeenQuery(urlQuery);
    setSearch(urlQuery);
  }

  useEffect(() => {
    // Newer browsers return a promise from scrollTo, so don't let the arrow return it to React.
    window.scrollTo(0, 0);
  }, [pathname]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(pathname === '/browse' ? params : undefined);
    if (search.trim()) next.set('q', search.trim());
    else next.delete('q');
    navigate(`/browse?${next}`);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand" aria-label="Game Store home">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={28} height={28} />
            <span>Game Store</span>
          </Link>
          <nav className="topbar__nav" aria-label="Main">
            <NavLink to="/" end>
              Store
            </NavLink>
            <NavLink to="/browse">Browse</NavLink>
            <NavLink to="/browse?list=wishlist" className={() => (params.get('list') === 'wishlist' ? 'active' : '')}>
              Wishlist{shop.wishlist.length > 0 && <span className="count">{shop.wishlist.length}</span>}
            </NavLink>
          </nav>
          <form className="search" role="search" onSubmit={submit}>
            <SearchIcon />
            <input
              type="search"
              placeholder="Search games, studios, genres"
              aria-label="Search games"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <button
            type="button"
            className="cart-button"
            aria-label={`Open cart, ${shop.cart.length} item${shop.cart.length === 1 ? '' : 's'}`}
            onClick={() => shop.setCartOpen(true)}
          >
            <CartIcon />
            {shop.cart.length > 0 && (
              <span className="count" key={shop.cart.length}>
                {shop.cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>
          Prices and details from the Steam Store (US), updated {timeAgo(catalog.generatedAt)}. Not affiliated with
          Valve; game names and images belong to their owners.
        </p>
        <p>
          Built by <a href="https://github.com/byocao">byocao</a> ·{' '}
          <a href="https://github.com/byocao/game-store">Source on GitHub</a>
        </p>
      </footer>

      <CartDrawer catalog={catalog} />
    </>
  );
}
