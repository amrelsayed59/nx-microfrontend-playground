export type OrderStatus = 'Pending' | 'Processing' | 'Completed';

export interface Order {
  id: string;
  customerName: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
}
