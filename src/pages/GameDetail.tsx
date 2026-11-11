import { useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Catalog } from '../types';
import { formatCount, isBuyable } from '../lib/format';
import { similarGames } from '../lib/browse';
import { useShop } from '../state/ShopProvider';
import { PriceTag } from '../components/PriceTag';
import { Rail } from '../components/Rail';
import { AppleIcon, ExternalIcon, HeartIcon, LinuxIcon, WindowsIcon } from '../components/Icons';
import { NotFound } from './NotFound';

export function GameDetail({ catalog }: { catalog: Catalog }) {
  const { id } = useParams();
  const game = id ? catalog.games[id] : undefined;
  const shop = useShop();
  // Remember the screenshot per game, so moving to another game starts from its first shot.
  const [picked, setPicked] = useState({ id, shot: 0 });
  const shot = picked.id === id ? picked.shot : 0;
  const setShot = (i: number) => setPicked({ id, shot: i });

  if (!game) return <NotFound />;

  const inCart = shop.cart.includes(game.id);
  const wished = shop.wishlist.includes(game.id);
  const current = game.screenshots[Math.min(shot, game.screenshots.length - 1)];
  const steamUrl = `https://store.steampowered.com/app/${game.id}`;

  return (
    <div className="page detail" key={game.id}>
      {game.background && <div className="detail__backdrop" style={{ backgroundImage: `url("${game.background}")` }} />}

      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/browse">Browse</Link>
        {game.genres[0] && (
          <>
            <span aria-hidden>/</span>
            <Link to={`/browse?genre=${encodeURIComponent(game.genres[0])}`}>{game.genres[0]}</Link>
          </>
        )}
      </nav>

      <h1 className="detail__title">{game.name}</h1>

      <div className="detail__top">
        <div className="gallery">
          {current ? (
            <img className="gallery__main" src={current.full} alt={`${game.name} screenshot ${shot + 1}`} />
          ) : (
            <img className="gallery__main" src={game.headerImage} alt={game.name} />
          )}
          {game.screenshots.length > 1 && (
            <div className="gallery__thumbs">
              {game.screenshots.map((s, i) => (
                <button
                  key={s.thumb}
                  type="button"
                  aria-label={`Show screenshot ${i + 1}`}
                  aria-current={i === shot}
                  onClick={() => setShot(i)}
                >
                  <img src={s.thumb} alt="" loading="lazy" width={150} height={84} />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="buy-box">
          <img src={game.headerImage} alt="" width={460} height={215} />
          <p className="buy-box__blurb">{game.shortDescription}</p>

          <dl className="facts">
            {game.metacritic !== null && (
              <div>
                <dt>Metacritic</dt>
                <dd>
                  <span className={`score score--${game.metacritic >= 75 ? 'good' : game.metacritic >= 50 ? 'mixed' : 'bad'}`}>
                    {game.metacritic}
                  </span>
                </dd>
              </div>
            )}
            {game.recommendations > 0 && (
              <div>
                <dt>Recommended by</dt>
                <dd>{formatCount(game.recommendations)} players</dd>
              </div>
            )}
            <div>
              <dt>Release</dt>
              <dd>{game.releaseDate || 'To be announced'}</dd>
            </div>
            {game.developers.length > 0 && (
              <div>
                <dt>Developer</dt>
                <dd>{game.developers.join(', ')}</dd>
              </div>
            )}
            {game.publishers.length > 0 && (
              <div>
                <dt>Publisher</dt>
                <dd>{game.publishers.join(', ')}</dd>
              </div>
            )}
            <div>
              <dt>Platforms</dt>
              <dd className="platforms">
                {game.platforms.windows && <WindowsIcon aria-label="Windows" role="img" />}
                {game.platforms.mac && <AppleIcon aria-label="macOS" role="img" />}
                {game.platforms.linux && <LinuxIcon aria-label="Linux" role="img" />}
              </dd>
            </div>
          </dl>

          <div className="tags">
            {game.genres.map((g) => (
              <Link key={g} className="chip chip--small" to={`/browse?genre=${encodeURIComponent(g)}`}>
                {g}
              </Link>
            ))}
          </div>

          <div className="buy-box__price">
            <PriceTag game={game} size="lg" />
          </div>
          <div className="buy-box__actions">
            {isBuyable(game) ? (
              <button
                type="button"
                className="button button--block"
                onClick={() => (inCart ? shop.setCartOpen(true) : shop.add(game.id))}
              >
                {inCart ? 'In cart, view cart' : 'Add to cart'}
              </button>
            ) : (
              <a className="button button--block" href={steamUrl} target="_blank" rel="noreferrer">
                {game.isFree ? 'Play free on Steam' : 'See it on Steam'}
              </a>
            )}
            <button
              type="button"
              className={`icon-button icon-button--large${wished ? ' is-active' : ''}`}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => shop.toggleWish(game.id)}
            >
              <HeartIcon filled={wished} />
            </button>
          </div>
          <a className="text-link external" href={steamUrl} target="_blank" rel="noreferrer">
            View on Steam <ExternalIcon width={16} height={16} />
          </a>
        </aside>
      </div>

      <div className="detail__body">
        <section className="prose" aria-labelledby="about-title">
          <h2 id="about-title">About this game</h2>
          {(game.about.length ? game.about : [game.shortDescription]).map((p, i) =>
            p.startsWith('• ') ? (
              <p key={i} className="bullet">
                {p.slice(2)}
              </p>
            ) : (
              <p key={i}>{p}</p>
            ),
          )}
        </section>

        <div className="detail__side">
          {game.features.length > 0 && (
            <section aria-labelledby="features-title">
              <h2 id="features-title">Features</h2>
              <ul className="feature-list">
                {game.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
          )}
          {game.requirements.length > 0 && (
            <section aria-labelledby="req-title">
              <h2 id="req-title">Minimum requirements</h2>
              <dl className="requirements">
                {game.requirements.map((r, i) => (
                  <div key={i}>
                    {r.label && <dt>{r.label}</dt>}
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>

      <Rail title="More like this" games={similarGames(catalog, game)} />
    </div>
  );
}
