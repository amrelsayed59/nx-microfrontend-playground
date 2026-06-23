import { computed, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { Order } from '@org/shared-models';
import { useOrdersStore } from '../stores/orders.store';
import type { OrderDraft } from '../features/orders/types/order-form.types';

export interface UseOrders {
  orders: ComputedRef<Order[]>;
  totalCount: ComputedRef<number>;
  search: Ref<string>;
  create: (draft: OrderDraft) => void;
  update: (order: Order) => void;
  remove: (id: string) => void;
}

/**
 * Feature facade: the single composable components use to read order state and
 * mutate it. Keeps Pinia wiring (store access, getters, actions) in one place
 * so Vue components never touch the store directly. Mirrors the React remote's
 * `useProducts` hook.
 */
export function useOrders(): UseOrders {
  const store = useOrdersStore();

  const search = ref('');

  const orders = computed<Order[]>(() => store.filteredOrders(search.value));
  const totalCount = computed<number>(() => store.getOrders.length);

  function create(draft: OrderDraft): void {
    store.addOrder(draft);
  }

  function update(order: Order): void {
    store.updateOrder(order);
  }

  function remove(id: string): void {
    store.deleteOrder(id);
  }

  return { orders, totalCount, search, create, update, remove };
}
