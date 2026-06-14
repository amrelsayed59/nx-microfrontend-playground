import { configureStore } from '@reduxjs/toolkit';
import { productsReducer } from '../features/products/store/products.slice';

/**
 * Root store for the products remote.
 *
 * A single module-level store instance is shared across every mount of the
 * remote (standalone bootstrap and every federated `mount()` call). This is
 * the standard RTK pattern and is intentional here: all instances of the
 * products feature observe the same catalog state.
 */
export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
