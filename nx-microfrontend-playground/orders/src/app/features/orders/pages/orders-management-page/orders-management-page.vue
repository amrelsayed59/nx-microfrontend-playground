<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Order } from '@org/shared-models';
import EmptyState from '../../../../components/empty-state/empty-state.vue';
import SearchInput from '../../../../components/search-input/search-input.vue';
import Modal from '../../../../shared/components/modal/modal.vue';
import ConfirmDelete from '../../components/confirm-delete/confirm-delete.vue';
import OrderForm from '../../components/order-form/order-form.vue';
import OrderTable from '../../components/order-table/order-table.vue';
import { userHasPermission } from '@org/shared-auth';
import { useOrders } from '../../../../composables/useOrders';
import { useAuth } from '../../../../auth/useAuth';
import type { OrderDraft } from '../../types/order-form.types';

const { orders, totalCount, search, create, update, remove } = useOrders();
const { user } = useAuth();

// Derived from the reactive `user` ref (via the shared permission matrix) so
// they recompute on login/logout.
const canCreate = computed(() => userHasPermission(user.value, 'order:create'));
const canEdit = computed(() => userHasPermission(user.value, 'order:update'));
const canDelete = computed(() => userHasPermission(user.value, 'order:delete'));

type Dialog =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; order: Order }
  | { kind: 'delete'; order: Order };

const dialog = ref<Dialog>({ kind: 'none' });
const close = (): void => {
  dialog.value = { kind: 'none' };
};

function handleCreate(draft: OrderDraft): void {
  create(draft);
  close();
}

function handleUpdate(draft: OrderDraft): void {
  if (dialog.value.kind === 'edit') {
    update({ ...draft, id: dialog.value.order.id });
  }
  close();
}

function handleDelete(): void {
  if (dialog.value.kind === 'delete') {
    remove(dialog.value.order.id);
  }
  close();
}

const hasOrders = computed(() => totalCount.value > 0);
const hasResults = computed(() => orders.value.length > 0);
</script>

<template>
  <div class="page">
    <div v-if="user" class="welcome">
      <span class="welcome-text">Welcome, {{ user.username }}</span>
      <span class="welcome-role">Role: {{ user.role }}</span>
    </div>

    <header class="header">
      <div>
        <h1 class="title">Order Management</h1>
        <p class="subtitle">Create, edit, and remove customer orders.</p>
      </div>
      <button
        v-if="canCreate"
        type="button"
        class="primary-button"
        @click="dialog = { kind: 'create' }"
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
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Create Order
      </button>
    </header>

    <div class="toolbar">
      <SearchInput
        v-model="search"
        placeholder="Search by customer, product, or status…"
        aria-label="Search orders"
      />
      <span class="count" aria-live="polite">
        {{ `${orders.length} of ${totalCount} orders` }}
      </span>
    </div>

    <EmptyState
      v-if="!hasOrders"
      title="No orders yet"
      description="Get started by creating your first customer order."
    >
      <template v-if="canCreate" #action>
        <button
          type="button"
          class="primary-button"
          @click="dialog = { kind: 'create' }"
        >
          Create Order
        </button>
      </template>
    </EmptyState>

    <OrderTable
      v-else-if="hasResults"
      :orders="orders"
      :can-edit="canEdit"
      :can-delete="canDelete"
      @edit="(order) => (dialog = { kind: 'edit', order })"
      @delete="(order) => (dialog = { kind: 'delete', order })"
    />

    <EmptyState
      v-else
      title="No orders found"
      :description="`No orders match “${search.trim()}”. Try a different search term.`"
    >
      <template #action>
        <button type="button" class="secondary-button" @click="search = ''">
          Clear search
        </button>
      </template>
    </EmptyState>

    <Modal
      v-if="dialog.kind === 'create'"
      title="Create order"
      @close="close"
    >
      <OrderForm @submit="handleCreate" @cancel="close" />
    </Modal>

    <Modal v-if="dialog.kind === 'edit'" title="Edit order" @close="close">
      <OrderForm
        :initial-order="dialog.order"
        @submit="handleUpdate"
        @cancel="close"
      />
    </Modal>

    <Modal v-if="dialog.kind === 'delete'" title="Delete order" @close="close">
      <ConfirmDelete
        :order="dialog.order"
        @confirm="handleDelete"
        @cancel="close"
      />
    </Modal>
  </div>
</template>

<style scoped lang="scss">
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5) var(--space-8);
}

.welcome {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-soft);
  border-radius: var(--radius-md);
}

.welcome-text {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary);
}

.welcome-role {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
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

@media (max-width: 640px) {
  .page {
    padding: var(--space-5) var(--space-4) var(--space-6);
  }

  .header {
    flex-direction: column;
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
