import { useState } from 'react';
import type { Product } from '@org/shared-models';
import { EmptyState } from '../../../../components/empty-state/empty-state';
import { SearchInput } from '../../../../components/search-input/search-input';
import { Modal } from '../../../../shared/components/modal/modal';
import { ConfirmDelete } from '../../components/confirm-delete/confirm-delete';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductTable } from '../../components/product-table/product-table';
import { useProducts } from '../../hooks/use-products';
import type { ProductDraft } from '../../types/product-form.types';
import styles from './products-management-page.module.scss';

type Dialog =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; product: Product }
  | { kind: 'delete'; product: Product };

export function ProductsManagementPage() {
  const { filteredProducts, totalCount, query, setQuery, create, update, remove } = useProducts();

  const [dialog, setDialog] = useState<Dialog>({ kind: 'none' });
  const close = () => setDialog({ kind: 'none' });

  function handleCreate(draft: ProductDraft): void {
    create(draft);
    close();
  }

  function handleUpdate(draft: ProductDraft): void {
    if (dialog.kind === 'edit') {
      update({ ...draft, id: dialog.product.id });
    }
    close();
  }

  function handleDelete(): void {
    if (dialog.kind === 'delete') {
      remove(dialog.product.id);
    }
    close();
  }

  const hasProducts = totalCount > 0;
  const hasResults = filteredProducts.length > 0;

  return (
    <div className={styles['page']}>
      <header className={styles['header']}>
        <div>
          <h1 className={styles['title']}>Product Management</h1>
          <p className={styles['subtitle']}>
            Create, edit, and remove products in the catalog.
          </p>
        </div>
        <button
          type="button"
          className={styles['primaryButton']}
          onClick={() => setDialog({ kind: 'create' })}
        >
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
          {`${filteredProducts.length} of ${totalCount} products`}
        </span>
      </div>

      {!hasProducts ? (
        <EmptyState
          title="No products yet"
          description="Get started by adding your first product to the catalog."
          action={
            <button
              type="button"
              className={styles['primaryButton']}
              onClick={() => setDialog({ kind: 'create' })}
            >
              Add Product
            </button>
          }
        />
      ) : hasResults ? (
        <ProductTable
          products={filteredProducts}
          onEdit={(product) => setDialog({ kind: 'edit', product })}
          onDelete={(product) => setDialog({ kind: 'delete', product })}
        />
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

      {dialog.kind === 'create' ? (
        <Modal title="Add product" onClose={close}>
          <ProductForm onSubmit={handleCreate} onCancel={close} />
        </Modal>
      ) : null}

      {dialog.kind === 'edit' ? (
        <Modal title="Edit product" onClose={close}>
          <ProductForm
            initialProduct={dialog.product}
            onSubmit={handleUpdate}
            onCancel={close}
          />
        </Modal>
      ) : null}

      {dialog.kind === 'delete' ? (
        <Modal title="Delete product" onClose={close}>
          <ConfirmDelete
            product={dialog.product}
            onConfirm={handleDelete}
            onCancel={close}
          />
        </Modal>
      ) : null}
    </div>
  );
}

export default ProductsManagementPage;
