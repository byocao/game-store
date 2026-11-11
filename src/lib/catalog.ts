import { useEffect, useState } from 'react';
import type { Catalog } from '../types';

let pending: Promise<Catalog> | null = null;

export function loadCatalog(): Promise<Catalog> {
  pending ??= fetch(`${import.meta.env.BASE_URL}data/catalog.json`).then((res) => {
    if (!res.ok) throw new Error(`Could not load the catalog (${res.status})`);
    return res.json() as Promise<Catalog>;
  });
  pending.catch(() => {
    pending = null; // let the next attempt try again
  });
  return pending;
}

type State = { catalog: Catalog; error: null } | { catalog: null; error: Error | null };

export function useCatalog(): State {
  const [state, setState] = useState<State>({ catalog: null, error: null });
  useEffect(() => {
    let live = true;
    loadCatalog().then(
      (catalog) => live && setState({ catalog, error: null }),
      (error: Error) => live && setState({ catalog: null, error }),
    );
    return () => {
      live = false;
    };
  }, []);
  return state;
}
