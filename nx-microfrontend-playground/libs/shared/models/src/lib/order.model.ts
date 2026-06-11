export type OrderStatus = 'Pending' | 'Fulfilled' | 'Cancelled';

export interface Order {
  id: string;
  customer: string;
  /** ISO 8601 date (yyyy-mm-dd) */
  date: string;
  status: OrderStatus;
  total: number;
}
