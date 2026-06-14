import { FormEvent, useState } from 'react';
import type { Product } from '@org/shared-models';
import type {
  ProductDraft,
  ProductFormErrors,
} from '../../types/product-form.types';
import styles from './product-form.module.scss';

export interface ProductFormProps {
  /** When provided, the form is in edit mode and pre-filled. */
  initialProduct?: Product;
  onSubmit: (draft: ProductDraft) => void;
  onCancel: () => void;
}

function validate(draft: ProductDraft): ProductFormErrors {
  const errors: ProductFormErrors = {};
  if (draft.name.trim() === '') {
    errors.name = 'Name is required.';
  }
  if (Number.isNaN(draft.price) || draft.price <= 0) {
    errors.price = 'Price must be greater than 0.';
  }
  return errors;
}

export function ProductForm({
  initialProduct,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const isEditing = initialProduct !== undefined;

  const [name, setName] = useState(initialProduct?.name ?? '');
  const [description, setDescription] = useState(
    initialProduct?.description ?? ''
  );
  const [price, setPrice] = useState(
    initialProduct ? String(initialProduct.price) : ''
  );
  const [errors, setErrors] = useState<ProductFormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const draft: ProductDraft = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: Number(price),
    };
    const validationErrors = validate(draft);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(draft);
  }

  return (
    <form className={styles['form']} onSubmit={handleSubmit} noValidate>
      <div className={styles['field']}>
        <label className={styles['label']} htmlFor="product-name">
          Name <span className={styles['required']}>*</span>
        </label>
        <input
          id="product-name"
          className={styles['input']}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? 'true' : 'false'}
          autoFocus
        />
        {errors.name ? (
          <p className={styles['error']}>{errors.name}</p>
        ) : null}
      </div>

      <div className={styles['field']}>
        <label className={styles['label']} htmlFor="product-description">
          Description
        </label>
        <textarea
          id="product-description"
          className={styles['textarea']}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
      </div>

      <div className={styles['field']}>
        <label className={styles['label']} htmlFor="product-price">
          Price (USD) <span className={styles['required']}>*</span>
        </label>
        <input
          id="product-price"
          className={styles['input']}
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          aria-invalid={errors.price ? 'true' : 'false'}
        />
        {errors.price ? (
          <p className={styles['error']}>{errors.price}</p>
        ) : null}
      </div>

      <div className={styles['actions']}>
        <button
          type="button"
          className={styles['secondaryButton']}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className={styles['primaryButton']}>
          {isEditing ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
