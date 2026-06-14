import type { Product } from '@org/shared-models';

/**
 * The editable shape of a product as captured by the form — everything
 * except the `id`, which the store owns (generated on create, preserved on
 * update). Keeping this separate from the domain `Product` keeps form
 * concerns out of the cross-MFE contract.
 */
export type ProductDraft = Omit<Product, 'id'>;

export interface ProductFormErrors {
  name?: string;
  price?: string;
}
