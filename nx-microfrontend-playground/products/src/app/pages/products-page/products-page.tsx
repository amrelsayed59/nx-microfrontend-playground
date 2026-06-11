import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../../components/empty-state/empty-state';
import {
  ProductTable,
  ProductTableSkeleton,
} from '../../components/product-table/product-table';
import { SearchInput } from '../../components/search-input/search-input';
import { PRODUCTS } from '../../data/products.data';
import styles from './products-page.module.scss';

export function ProductsPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulates the latency of a real catalog API so the loading state is
  // visible. Replaced by a data-access layer in a later milestone.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized === '') {
      return PRODUCTS;
    }
    return PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <div className={styles['page']}>
      <header className={styles['header']}>
        <div>
          <h1 className={styles['title']}>Products</h1>
          <p className={styles['subtitle']}>
            Manage your product catalog and pricing.
          </p>
        </div>
        <button type="button" className={styles['primaryButton']}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add Product
        </button>
      </header>

      <div className={styles['toolbar']}>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search products…"
          ariaLabel="Search products"
        />
        <span className={styles['count']} aria-live="polite">
          {isLoading
            ? 'Loading…'
            : `${filteredProducts.length} of ${PRODUCTS.length} products`}
        </span>
      </div>

      {isLoading ? (
        <ProductTableSkeleton rows={3} />
      ) : filteredProducts.length > 0 ? (
        <ProductTable products={filteredProducts} />
      ) : (
        <EmptyState
          title="No products found"
          description={`No products match "${query.trim()}". Try a different search term.`}
          action={
            <button
              type="button"
              className={styles['secondaryButton']}
              onClick={() => setQuery('')}
            >
              Clear search
            </button>
          }
        />
      )}
    </div>
  );
}

export default ProductsPage;
