import type { Product } from '@org/shared-models';
import styles from './confirm-delete.module.scss';

export interface ConfirmDeleteProps {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDelete({
  product,
  onConfirm,
  onCancel,
}: ConfirmDeleteProps) {
  return (
    <div className={styles['container']}>
      <p className={styles['message']}>
        Are you sure you want to delete <strong>{product.name}</strong>? This
        action cannot be undone.
      </p>
      <div className={styles['actions']}>
        <button
          type="button"
          className={styles['secondaryButton']}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className={styles['dangerButton']}
          onClick={onConfirm}
        >
          Delete product
        </button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
