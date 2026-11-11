/** Cart and wishlist state. Kept as plain functions so it is easy to test. */

export interface ShopState {
  cart: number[];
  wishlist: number[];
}

export type ShopAction =
  | { type: 'add'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clearCart' }
  | { type: 'toggleWish'; id: number }
  | { type: 'replace'; state: ShopState };

export const emptyShop: ShopState = { cart: [], wishlist: [] };

export function shopReducer(state: ShopState, action: ShopAction): ShopState {
  switch (action.type) {
    case 'add':
      // Adding to the cart takes the game off the wishlist, like most stores do.
      return state.cart.includes(action.id)
        ? state
        : { cart: [...state.cart, action.id], wishlist: state.wishlist.filter((id) => id !== action.id) };
    case 'remove':
      return { ...state, cart: state.cart.filter((id) => id !== action.id) };
    case 'clearCart':
      return { ...state, cart: [] };
    case 'toggleWish':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((id) => id !== action.id)
          : [...state.wishlist, action.id],
      };
    case 'replace':
      return action.state;
  }
}

export const STORAGE_KEY = 'game-store:v2';
const KEY = STORAGE_KEY;

export function loadShop(storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage): ShopState {
  try {
    const saved = JSON.parse(storage?.getItem(KEY) ?? 'null');
    const ids = (value: unknown) => (Array.isArray(value) ? value.filter(Number.isInteger) : []);
    return saved ? { cart: ids(saved.cart), wishlist: ids(saved.wishlist) } : emptyShop;
  } catch {
    return emptyShop;
  }
}

export function saveShop(state: ShopState, storage: Pick<Storage, 'setItem'> | undefined = globalThis.localStorage) {
  try {
    storage?.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or storage turned off: the cart just won't survive a reload.
  }
}
