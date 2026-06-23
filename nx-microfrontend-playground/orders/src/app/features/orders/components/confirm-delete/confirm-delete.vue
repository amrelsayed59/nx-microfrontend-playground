<script setup lang="ts">
import type { Order } from '@org/shared-models';

defineProps<{
  order: Order;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <div class="container">
    <p class="message">
      Are you sure you want to delete order
      <strong>{{ order.id }}</strong> for
      <strong>{{ order.customerName }}</strong>? This action cannot be undone.
    </p>
    <div class="actions">
      <button type="button" class="secondary-button" @click="emit('cancel')">
        Cancel
      </button>
      <button type="button" class="danger-button" @click="emit('confirm')">
        Delete order
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.message {
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.secondary-button {
  display: inline-flex;
  align-items: center;
  height: 38px;
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

.danger-button {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-danger);
  color: #ffffff;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(0.94);
  }
}
</style>
