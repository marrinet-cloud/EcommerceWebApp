import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "cart";

const loadCart = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const initialState = { items: loadCart() };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((p) => p.id === product.id);
      if (existing) existing.count += 1;
      else state.items.push({ ...product, count: 1 });
      saveCart(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      saveCart(state.items);
    },
    decrement(state, action) {
      const existing = state.items.find((p) => p.id === action.payload);
      if (!existing) return;
      existing.count -= 1;
      if (existing.count <= 0) {
        state.items = state.items.filter((p) => p.id !== action.payload);
      }
      saveCart(state.items);
    },
    setCount(state, action) {
      const { id, count } = action.payload;
      const existing = state.items.find((p) => p.id === id);
      if (!existing) return;
      existing.count = Math.max(1, Number(count) || 1);
      saveCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
  },
});

export const { addToCart, removeFromCart, decrement, setCount, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
