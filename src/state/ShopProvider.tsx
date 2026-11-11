import { createContext, use, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { STORAGE_KEY, loadShop, saveShop, shopReducer, type ShopState } from './shop';

interface Shop extends ShopState {
  add: (id: number) => void;
  remove: (id: number) => void;
  clearCart: () => void;
  toggleWish: (id: number) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const ShopContext = createContext<Shop | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shopReducer, undefined, () => loadShop());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    saveShop(state);
  }, [state]);

  // Keep several open tabs in step.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: 'replace', state: loadShop() });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<Shop>(
    () => ({
      ...state,
      add: (id) => dispatch({ type: 'add', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clearCart: () => dispatch({ type: 'clearCart' }),
      toggleWish: (id) => dispatch({ type: 'toggleWish', id }),
      cartOpen,
      setCartOpen,
    }),
    [state, cartOpen],
  );

  return <ShopContext value={value}>{children}</ShopContext>;
}

export function useShop(): Shop {
  const shop = use(ShopContext);
  if (!shop) throw new Error('useShop must be used inside <ShopProvider>');
  return shop;
}
