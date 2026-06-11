import { computed, onMounted, ref } from 'vue';
import type { Order } from '@org/shared-models';
import type {
  OrderSortKey,
  OrderStats,
  SortDirection,
} from '../models/order-view.model';
import { fetchOrders } from '../services/orders.service';

/**
 * Owns all orders page state: loading, search, sorting, and derived stats.
 * Components stay presentational; this composable is the single stateful
 * unit (and the seam where pagination/filters/API params will plug in).
 */
export function useOrders() {
  const orders = ref<Order[]>([]);
  const isLoading = ref(true);
  const query = ref('');
  const sortKey = ref<OrderSortKey>('date');
  const sortDirection = ref<SortDirection>('desc');

  onMounted(async () => {
    orders.value = await fetchOrders();
    isLoading.value = false;
  });

  const visibleOrders = computed<Order[]>(() => {
    const normalized = query.value.trim().toLowerCase();
    const filtered = normalized
      ? orders.value.filter(
          (order) =>
            order.customer.toLowerCase().includes(normalized) ||
            order.id.toLowerCase().includes(normalized)
        )
      : orders.value;

    const direction = sortDirection.value === 'asc' ? 1 : -1;
    const key = sortKey.value;
    return [...filtered].sort((a, b) => {
      if (key === 'total') {
        return (a.total - b.total) * direction;
      }
      return a[key].localeCompare(b[key]) * direction;
    });
  });

  const stats = computed<OrderStats>(() => {
    const today = new Date().toISOString().slice(0, 10);
    return orders.value.reduce<OrderStats>(
      (acc, order) => {
        if (order.status !== 'Cancelled') {
          acc.totalRevenue += order.total;
        }
        if (order.date === today) {
          acc.ordersToday += 1;
        }
        if (order.status === 'Pending') {
          acc.pendingOrders += 1;
        }
        if (order.status === 'Fulfilled') {
          acc.fulfilledOrders += 1;
        }
        return acc;
      },
      { totalRevenue: 0, ordersToday: 0, pendingOrders: 0, fulfilledOrders: 0 }
    );
  });

  const totalCount = computed(() => orders.value.length);

  function toggleSort(key: OrderSortKey): void {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortDirection.value = key === 'date' ? 'desc' : 'asc';
    }
  }

  return {
    isLoading,
    query,
    sortKey,
    sortDirection,
    visibleOrders,
    stats,
    totalCount,
    toggleSort,
  };
}
