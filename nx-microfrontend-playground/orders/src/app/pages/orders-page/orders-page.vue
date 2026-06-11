<script setup lang="ts">
import { computed } from 'vue';
import { useOrders } from '../../composables/use-orders';
import EmptyState from '../../components/empty-state/empty-state.vue';
import KpiCard from '../../components/kpi-card/kpi-card.vue';
import OrdersTable from '../../components/orders-table/orders-table.vue';
import SearchInput from '../../components/search-input/search-input.vue';

const {
  isLoading,
  query,
  sortKey,
  sortDirection,
  visibleOrders,
  stats,
  totalCount,
  toggleSort,
} = useOrders();

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const countLabel = computed(() =>
  isLoading.value
    ? 'Loading…'
    : `${visibleOrders.value.length} of ${totalCount.value} orders`
);
</script>

<template>
  <div class="page">
    <header class="header">
      <div>
        <h1 class="title">Orders</h1>
        <p class="subtitle">Track and manage customer orders.</p>
      </div>
      <button type="button" class="primary-button">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Create Order
      </button>
    </header>

    <section class="stats" aria-label="Order statistics">
      <KpiCard
        label="Total Revenue"
        :value="isLoading ? '—' : currencyFormatter.format(stats.totalRevenue)"
        hint="Excluding cancelled orders"
      />
      <KpiCard
        label="Orders Today"
        :value="isLoading ? '—' : String(stats.ordersToday)"
      />
      <KpiCard
        label="Pending"
        :value="isLoading ? '—' : String(stats.pendingOrders)"
      />
      <KpiCard
        label="Fulfilled"
        :value="isLoading ? '—' : String(stats.fulfilledOrders)"
      />
    </section>

    <div class="toolbar">
      <SearchInput
        v-model="query"
        placeholder="Search orders or customers…"
        aria-label="Search orders"
      />
      <span class="count" aria-live="polite">{{ countLabel }}</span>
    </div>

    <OrdersTable
      v-if="isLoading || visibleOrders.length > 0"
      :orders="visibleOrders"
      :sort-key="sortKey"
      :sort-direction="sortDirection"
      :loading="isLoading"
      @sort="toggleSort"
    />
    <EmptyState
      v-else
      title="No orders found"
      :description="`No orders match “${query.trim()}”. Try a different search term.`"
    >
      <template #action>
        <button type="button" class="secondary-button" @click="query = ''">
          Clear search
        </button>
      </template>
    </EmptyState>
  </div>
</template>

<style scoped lang="scss">
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5) var(--space-8);
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.title {
  margin: 0 0 var(--space-1);
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.subtitle {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.primary-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 38px;
  padding: 0 var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #ffffff;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--shadow-xs);
  transition: background-color 0.15s ease;

  &:hover {
    background: var(--color-primary-hover);
  }
}

.secondary-button {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    border-color: var(--color-border-strong);
    background: var(--color-bg);
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 900px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page {
    padding: var(--space-5) var(--space-4) var(--space-6);
  }

  .header {
    flex-direction: column;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .count {
    text-align: right;
  }
}
</style>
