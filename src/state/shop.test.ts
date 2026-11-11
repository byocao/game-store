import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, emptyShop, loadShop, saveShop, shopReducer } from './shop';

describe('shopReducer', () => {
  it('adds a game to the cart once and takes it off the wishlist', () => {
    let state = shopReducer(emptyShop, { type: 'toggleWish', id: 7 });
    state = shopReducer(state, { type: 'add', id: 7 });
    state = shopReducer(state, { type: 'add', id: 7 });
    expect(state).toEqual({ cart: [7], wishlist: [] });
  });

  it('removes and clears', () => {
    let state = { cart: [1, 2, 3], wishlist: [9] };
    state = shopReducer(state, { type: 'remove', id: 2 });
    expect(state.cart).toEqual([1, 3]);
    expect(shopReducer(state, { type: 'clearCart' })).toEqual({ cart: [], wishlist: [9] });
  });

  it('toggles the wishlist', () => {
    const on = shopReducer(emptyShop, { type: 'toggleWish', id: 4 });
    expect(on.wishlist).toEqual([4]);
    expect(shopReducer(on, { type: 'toggleWish', id: 4 }).wishlist).toEqual([]);
  });
});

describe('persistence', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
  };

  it('saves and loads', () => {
    const storage = memory();
    saveShop({ cart: [1], wishlist: [2] }, storage);
    expect(loadShop(storage)).toEqual({ cart: [1], wishlist: [2] });
  });

  it('survives corrupt or hostile data', () => {
    const storage = memory();
    storage.setItem(STORAGE_KEY, '{not json');
    expect(loadShop(storage)).toEqual(emptyShop);
    storage.setItem(STORAGE_KEY, JSON.stringify({ cart: [1, 'x', 2.5, null], wishlist: 'nope' }));
    expect(loadShop(storage)).toEqual({ cart: [1], wishlist: [] });
  });
});
