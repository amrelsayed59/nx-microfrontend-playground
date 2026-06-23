import type { Order } from '@org/shared-models';

/**
 * Seed catalog used to initialise the orders store. In production this is
 * replaced by data fetched from the orders API (see the README "API migration
 * strategy"). Keeping it in `data/` isolates the swap point.
 */
export const ORDERS_SEED: Order[] = [
  {
    id: 'ORD-1001',
    customerName: 'John Smith',
    productName: 'MacBook Pro 16"',
    quantity: 1,
    totalPrice: 2499,
    status: 'Completed',
  },
  {
    id: 'ORD-1002',
    customerName: 'Sarah Johnson',
    productName: 'iPhone 17 Pro',
    quantity: 2,
    totalPrice: 2398,
    status: 'Processing',
  },
  {
    id: 'ORD-1003',
    customerName: 'Michael Brown',
    productName: 'AirPods Pro 3',
    quantity: 3,
    totalPrice: 747,
    status: 'Pending',
  },
  {
    id: 'ORD-1004',
    customerName: 'Emma Davis',
    productName: 'iPad Pro 13"',
    quantity: 1,
    totalPrice: 1299,
    status: 'Completed',
  },
  {
    id: 'ORD-1005',
    customerName: 'David Wilson',
    productName: 'Apple Watch Ultra 3',
    quantity: 2,
    totalPrice: 1598,
    status: 'Pending',
  },
];
