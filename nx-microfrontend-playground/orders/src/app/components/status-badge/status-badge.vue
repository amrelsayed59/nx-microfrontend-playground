<script setup lang="ts">
import { computed } from 'vue';
import type { OrderStatus } from '@org/shared-models';

const props = defineProps<{
  status: OrderStatus;
}>();

const statusClass = computed(() => {
  const classByStatus: Record<OrderStatus, string> = {
    Pending: 'pending',
    Fulfilled: 'fulfilled',
    Cancelled: 'cancelled',
  };
  return classByStatus[props.status];
});
</script>

<template>
  <span class="badge" :class="statusClass">
    <span class="dot" aria-hidden="true"></span>
    {{ status }}
  </span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 2px var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: currentColor;
}

.fulfilled {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.pending {
  background: var(--color-warning-soft);
  color: var(--color-warning);
}

.cancelled {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}
</style>
