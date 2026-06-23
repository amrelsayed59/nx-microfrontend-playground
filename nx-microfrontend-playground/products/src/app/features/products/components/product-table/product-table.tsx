import type { Product } from '@org/shared-models';
import styles from './product-table.module.scss';

export interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function ProductTable({
  products,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: ProductTableProps) {
  const showActions = canEdit || canDelete;
  return (
    <div className={styles['card']}>
      <table className={styles['table']}>
        <thead>
          <tr>
            <th scope="col" className={styles['colId']}>
              ID
            </th>
            <th scope="col">Name</th>
            <th scope="col" className={styles['colDescription']}>
              Description
            </th>
            <th scope="col" className={styles['colPrice']}>
              Price
            </th>
            {showActions ? (
              <th scope="col" className={styles['colActions']}>
                <span className={styles['srOnly']}>Actions</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={styles['row']}>
              <td data-label="ID" className={styles['cellId']}>
                #{product.id}
              </td>
              <td data-label="Name" className={styles['cellName']}>
                {product.name}
              </td>
              <td data-label="Description" className={styles['cellDescription']}>
                {product.description ?? (
                  <span className={styles['muted']}>—</span>
                )}
              </td>
              <td data-label="Price" className={styles['cellPrice']}>
                {priceFormatter.format(product.price)}
              </td>
              {showActions ? (
                <td className={styles['cellActions']}>
                  <div className={styles['actions']}>
                    {canEdit ? (
                      <button
                        type="button"
                        className={styles['iconButton']}
                        onClick={() => onEdit(product)}
                        aria-label={`Edit ${product.name}`}
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
                          <path
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          />
                          <path
                            d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"
                          />
                        </svg>
                      </button>
                    ) : null}
                    {canDelete ? (
                      <button
                        type="button"
                        className={`${styles['iconButton']} ${styles['iconButtonDanger']}`}
                        onClick={() => onDelete(product)}
                        aria-label={`Delete ${product.name}`}
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
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
