import type { Order } from '@org/shared-models';

/**
 * Data source for the orders domain. Currently in-memory mock data behind a
 * Promise so the rest of the app already consumes it asynchronously —
 * swapping in a real HTTP call later changes only this file.
 */
const ORDERS: Order[] = [
  { id: 'ORD-1001', customer: 'John Smith', date: '2026-06-10', status: 'Fulfilled', total: 2499 },
  { id: 'ORD-1002', customer: 'Sarah Johnson', date: '2026-06-09', status: 'Pending', total: 799 },
  { id: 'ORD-1003', customer: 'Michael Brown', date: '2026-06-08', status: 'Cancelled', total: 199 },
  { id: 'ORD-1004', customer: 'Emma Davis', date: '2026-06-10', status: 'Pending', total: 1499 },
  { id: 'ORD-1005', customer: 'David Wilson', date: '2026-06-07', status: 'Fulfilled', total: 349 },
  { id: 'ORD-1006', customer: 'Lisa Anderson', date: '2026-06-06', status: 'Fulfilled', total: 89 },
];

const SIMULATED_LATENCY_MS = 700;

export function fetchOrders(): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...ORDERS]), SIMULATED_LATENCY_MS);
  });
}
