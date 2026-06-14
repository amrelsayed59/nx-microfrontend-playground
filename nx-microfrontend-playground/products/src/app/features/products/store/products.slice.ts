import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@org/shared-models';
import type { ProductDraft } from '../types/product-form.types';
import { PRODUCTS_SEED } from './products.seed';

export interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: PRODUCTS_SEED,
};

/**
 * Next numeric id, derived as `max(existing) + 1`. The domain `Product.id` is
 * a `number`, so we generate sequential numeric ids rather than UUID strings —
 * this keeps the existing cross-MFE contract (and its consumers) stable.
 */
function nextId(items: Product[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Accepts a draft (no id); the reducer owns id generation because it has
    // access to current state.
    addProduct(state, action: PayloadAction<ProductDraft>) {
      state.items.push({ ...action.payload, id: nextId(state.items) });
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } = productsSlice.actions;

export const productsReducer = productsSlice.reducer;
