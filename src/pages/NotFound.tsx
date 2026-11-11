import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="page empty empty--page">
      <p className="eyebrow">404</p>
      <h1>This page doesn't exist</h1>
      <p className="muted">The game may have left the store, or the link is wrong.</p>
      <Link className="button" to="/browse">
        Browse games
      </Link>
    </div>
  );
}
