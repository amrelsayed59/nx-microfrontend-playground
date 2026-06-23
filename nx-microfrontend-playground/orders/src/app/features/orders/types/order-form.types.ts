import type { Order } from '@org/shared-models';

/**
 * Editable shape of an order as captured by the form — everything except the
 * `id`, which the store owns (generated on create, preserved on update).
 * Mirrors the React remote's `ProductDraft`.
 */
export type OrderDraft = Omit<Order, 'id'>;

export interface OrderFormErrors {
  customerName?: string;
  productName?: string;
  quantity?: string;
  totalPrice?: string;
}
