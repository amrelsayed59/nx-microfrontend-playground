import { defineStore } from 'pinia';
import type { Order } from '@org/shared-models';
import { ORDERS_SEED } from '../features/orders/data/orders.seed';
import type { OrderDraft } from '../features/orders/types/order-form.types';

export interface OrdersState {
  items: Order[];
}

/**
 * Next order id in the `ORD-####` format, derived as `max(existing) + 1`.
 * Mirrors the numeric id generation in the React products slice, adapted to
 * the orders' string id convention.
 */
function nextOrderId(items: Order[]): string {
  const maxNumber = items.reduce((max, order) => {
    const parsed = Number(order.id.replace(/^ORD-/, ''));
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 1000);
  return `ORD-${maxNumber + 1}`;
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    items: ORDERS_SEED,
  }),

  getters: {
    getOrders: (state): Order[] => state.items,

    getOrderById: (state) => {
      return (id: string): Order | undefined =>
        state.items.find((order) => order.id === id);
    },

    // Returns a function so the query participates without living in state
    // (OrdersState intentionally holds only `items`).
    filteredOrders: (state) => {
      return (query: string): Order[] => {
        const normalized = query.trim().toLowerCase();
        if (normalized === '') {
          return state.items;
        }
        return state.items.filter(
          (order) =>
            order.customerName.toLowerCase().includes(normalized) ||
            order.productName.toLowerCase().includes(normalized) ||
            order.status.toLowerCase().includes(normalized)
        );
      };
    },
  },

  actions: {
    // Accepts a draft (no id); the action owns id generation.
    addOrder(draft: OrderDraft): void {
      this.items.push({ ...draft, id: nextOrderId(this.items) });
    },

    updateOrder(order: Order): void {
      const index = this.items.findIndex((item) => item.id === order.id);
      if (index !== -1) {
        this.items[index] = order;
      }
    },

    deleteOrder(id: string): void {
      this.items = this.items.filter((order) => order.id !== id);
    },
  },
});
