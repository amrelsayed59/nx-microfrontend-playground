<script setup lang="ts">
import { computed } from 'vue';
import type { Order } from '@org/shared-models';
import StatusBadge from '../status-badge/status-badge.vue';

const props = defineProps<{
  orders: Order[];
  canEdit: boolean;
  canDelete: boolean;
}>();

const emit = defineEmits<{
  edit: [order: Order];
  delete: [order: Order];
}>();

const showActions = computed(() => props.canEdit || props.canDelete);

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
</script>

<template>
  <div class="card">
    <table class="table">
      <thead>
        <tr>
          <th scope="col" class="col-id">Order ID</th>
          <th scope="col">Customer</th>
          <th scope="col">Product</th>
          <th scope="col" class="col-qty">Qty</th>
          <th scope="col" class="col-total">Total</th>
          <th scope="col">Status</th>
          <th v-if="showActions" scope="col" class="col-actions">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="row">
          <td data-label="Order ID" class="cell-id">{{ order.id }}</td>
          <td data-label="Customer" class="cell-customer">
            {{ order.customerName }}
          </td>
          <td data-label="Product">{{ order.productName }}</td>
          <td data-label="Qty" class="cell-qty">{{ order.quantity }}</td>
          <td data-label="Total" class="cell-total">
            {{ currencyFormatter.format(order.totalPrice) }}
          </td>
          <td data-label="Status">
            <StatusBadge :status="order.status" />
          </td>
          <td v-if="showActions" class="cell-actions">
            <div class="actions">
              <button
                v-if="canEdit"
                type="button"
                class="icon-button"
                :aria-label="`Edit order ${order.id}`"
                @click="emit('edit', order)"
              >
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
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                </svg>
              </button>
              <button
                v-if="canDelete"
                type="button"
                class="icon-button icon-button-danger"
                :aria-label="`Delete order ${order.id}`"
                @click="emit('delete', order)"
              >
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
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
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
    vertical-align: middle;
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

.col-id {
  width: 110px;
}

.col-qty,
.cell-qty {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.col-total,
.cell-total {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.col-actions {
  width: 96px;
}

.cell-id {
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.cell-customer {
  font-weight: 500;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-1);
}

.icon-button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--color-text);
    background: var(--color-bg);
  }
}

.icon-button-danger:hover {
  color: var(--color-danger);
  background: var(--color-danger-soft);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 760px) {
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
  .cell-qty,
  .cell-total {
    width: auto;
    text-align: left;
  }

  .actions {
    justify-content: flex-start;
  }
}
</style>
