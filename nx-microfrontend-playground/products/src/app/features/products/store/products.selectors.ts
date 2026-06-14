import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

const selectProductsState = (state: RootState) => state.products;

export const selectAllProducts = createSelector(
  selectProductsState,
  (productsState) => productsState.items
);

export const selectProductCount = createSelector(
  selectAllProducts,
  (items) => items.length
);
