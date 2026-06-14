import { useCallback, useMemo, useState } from 'react';
import type { Product } from '@org/shared-models';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectAllProducts,
  selectProductCount,
} from '../store/products.selectors';
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from '../store/products.slice';
import type { ProductDraft } from '../types/product-form.types';

/**
 * Feature facade: the single hook components use to read product state and
 * mutate it. Keeps Redux wiring (selectors, dispatch, action creators) in one
 * place so presentational components stay unaware of the store.
 */
export function useProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const totalCount = useAppSelector(selectProductCount);

  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized === '') {
      return products;
    }
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        (product.description ?? '').toLowerCase().includes(normalized)
    );
  }, [products, query]);

  const create = useCallback(
    (draft: ProductDraft) => dispatch(addProduct(draft)),
    [dispatch]
  );

  const update = useCallback(
    (product: Product) => dispatch(updateProduct(product)),
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteProduct(id)),
    [dispatch]
  );

  return {
    products,
    filteredProducts,
    totalCount,
    query,
    setQuery,
    create,
    update,
    remove,
  };
}
