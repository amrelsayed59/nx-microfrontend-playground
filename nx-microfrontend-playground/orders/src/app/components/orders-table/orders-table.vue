<script setup lang="ts">
import type { Order } from '@org/shared-models';
import type {
  OrderSortKey,
  SortDirection,
} from '../../models/order-view.model';
import StatusBadge from '../status-badge/status-badge.vue';

defineProps<{
  orders: Order[];
  sortKey: OrderSortKey;
  sortDirection: SortDirection;
  loading?: boolean;
}>();

const emit = defineEmits<{
  sort: [key: OrderSortKey];
}>();

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00`));
}
</script>

<template>
  <div class="card">
    <table class="table" :aria-busy="loading ? 'true' : 'false'">
      <thead>
        <tr>
          <th scope="col" class="col-id">Order ID</th>
          <th
            scope="col"
            :aria-sort="
              sortKey === 'customer'
                ? sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none'
            "
          >
            <button
              type="button"
              class="sort-button"
              @click="emit('sort', 'customer')"
            >
              Customer
              <span
                class="sort-indicator"
                :class="{ active: sortKey === 'customer' }"
                aria-hidden="true"
                >{{
                  sortKey === 'customer' && sortDirection === 'desc' ? '↓' : '↑'
                }}</span
              >
            </button>
          </th>
          <th
            scope="col"
            :aria-sort="
              sortKey === 'date'
                ? sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none'
            "
          >
            <button
              type="button"
              class="sort-button"
              @click="emit('sort', 'date')"
            >
              Date
              <span
                class="sort-indicator"
                :class="{ active: sortKey === 'date' }"
                aria-hidden="true"
                >{{
                  sortKey === 'date' && sortDirection === 'desc' ? '↓' : '↑'
                }}</span
              >
            </button>
          </th>
          <th scope="col">Status</th>
          <th
            scope="col"
            class="col-total"
            :aria-sort="
              sortKey === 'total'
                ? sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none'
            "
          >
            <button
              type="button"
              class="sort-button sort-button-right"
              @click="emit('sort', 'total')"
            >
              Total
              <span
                class="sort-indicator"
                :class="{ active: sortKey === 'total' }"
                aria-hidden="true"
                >{{
                  sortKey === 'total' && sortDirection === 'desc' ? '↓' : '↑'
                }}</span
              >
            </button>
          </th>
        </tr>
      </thead>

      <tbody v-if="loading">
        <tr v-for="row in 4" :key="row" class="row">
          <td><span class="skeleton" style="width: 4.5rem"></span></td>
          <td><span class="skeleton" style="width: 55%"></span></td>
          <td><span class="skeleton" style="width: 5rem"></span></td>
          <td><span class="skeleton" style="width: 4rem"></span></td>
          <td class="cell-total">
            <span class="skeleton" style="width: 3.5rem"></span>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr v-for="order in orders" :key="order.id" class="row">
          <td data-label="Order ID" class="cell-id">{{ order.id }}</td>
          <td data-label="Customer" class="cell-customer">
            {{ order.customer }}
          </td>
          <td data-label="Date" class="cell-date">
            {{ formatDate(order.date) }}
          </td>
          <td data-label="Status">
            <StatusBadge :status="order.status" />
          </td>
          <td data-label="Total" class="cell-total">
            {{ currencyFormatter.format(order.total) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: var(--space-3) var(--space-4);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    font-size: var(--text-sm);
    color: var(--color-text);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.row {
  transition: background-color 0.1s ease;

  &:hover {
    background: var(--color-bg);
  }
}

.sort-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  cursor: pointer;

  &:hover {
    color: var(--color-text);
  }
}

.sort-indicator {
  opacity: 0;
  transition: opacity 0.1s ease;

  &.active {
    opacity: 1;
    color: var(--color-primary);
  }
}

.sort-button:hover .sort-indicator {
  opacity: 0.5;

  &.active {
    opacity: 1;
  }
}

.col-id {
  width: 110px;
}

.col-total,
.cell-total {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.cell-id {
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.cell-customer {
  font-weight: 500;
}

.cell-date {
  color: var(--color-text-secondary);
}

/* Loading skeleton */
.skeleton {
  display: inline-block;
  height: 0.875rem;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    var(--color-border) 25%,
    var(--color-bg) 50%,
    var(--color-border) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive: table collapses to cards below 640px */
@media (max-width: 640px) {
  .table {
    thead {
      display: none;
    }

    tbody,
    tr,
    td {
      display: block;
    }

    tr {
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--color-border);

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-1) 0;
      border-bottom: none;

      &::before {
        content: attr(data-label);
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }

  .col-id,
  .cell-id,
  .cell-total {
    width: auto;
    text-align: left;
  }
}
</style>
