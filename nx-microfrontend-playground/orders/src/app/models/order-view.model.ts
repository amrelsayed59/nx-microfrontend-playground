/**
 * Remote-internal view models. The cross-MFE `Order` contract lives in
 * `@org/shared-models` — these types only describe how THIS remote
 * presents orders, so they stay private to the orders app.
 */
export interface OrderStats {
  totalRevenue: number;
  ordersToday: number;
  pendingOrders: number;
  fulfilledOrders: number;
}

export type OrderSortKey = 'customer' | 'date' | 'total';

export type SortDirection = 'asc' | 'desc';
