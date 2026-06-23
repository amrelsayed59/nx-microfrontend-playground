<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Order, OrderStatus } from '@org/shared-models';
import type {
  OrderDraft,
  OrderFormErrors,
} from '../../types/order-form.types';

const props = defineProps<{
  /** When provided, the form is in edit mode and pre-filled. */
  initialOrder?: Order;
}>();

const emit = defineEmits<{
  submit: [draft: OrderDraft];
  cancel: [];
}>();

const STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Completed'];

const isEditing = props.initialOrder !== undefined;

const form = reactive<OrderDraft>({
  customerName: props.initialOrder?.customerName ?? '',
  productName: props.initialOrder?.productName ?? '',
  quantity: props.initialOrder?.quantity ?? 1,
  totalPrice: props.initialOrder?.totalPrice ?? 0,
  // Create defaults to Pending; edit preserves the existing status.
  status: props.initialOrder?.status ?? 'Pending',
});

const errors = ref<OrderFormErrors>({});

function validate(): boolean {
  const next: OrderFormErrors = {};
  if (form.customerName.trim() === '') {
    next.customerName = 'Customer name is required.';
  }
  if (form.productName.trim() === '') {
    next.productName = 'Product name is required.';
  }
  if (Number.isNaN(form.quantity) || form.quantity < 1) {
    next.quantity = 'Quantity must be at least 1.';
  }
  if (Number.isNaN(form.totalPrice) || form.totalPrice < 0) {
    next.totalPrice = 'Total price cannot be negative.';
  }
  errors.value = next;
  return Object.keys(next).length === 0;
}

function handleSubmit(): void {
  if (!validate()) {
    return;
  }
  emit('submit', {
    customerName: form.customerName.trim(),
    productName: form.productName.trim(),
    quantity: Number(form.quantity),
    totalPrice: Number(form.totalPrice),
    status: form.status,
  });
}
</script>

<template>
  <form class="form" novalidate @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label" for="order-customer">
        Customer name <span class="required">*</span>
      </label>
      <input
        id="order-customer"
        v-model="form.customerName"
        class="input"
        :aria-invalid="errors.customerName ? 'true' : 'false'"
      />
      <p v-if="errors.customerName" class="error">{{ errors.customerName }}</p>
    </div>

    <div class="field">
      <label class="label" for="order-product">
        Product name <span class="required">*</span>
      </label>
      <input
        id="order-product"
        v-model="form.productName"
        class="input"
        :aria-invalid="errors.productName ? 'true' : 'false'"
      />
      <p v-if="errors.productName" class="error">{{ errors.productName }}</p>
    </div>

    <div class="row">
      <div class="field">
        <label class="label" for="order-quantity">
          Quantity <span class="required">*</span>
        </label>
        <input
          id="order-quantity"
          v-model.number="form.quantity"
          class="input"
          type="number"
          min="1"
          step="1"
          :aria-invalid="errors.quantity ? 'true' : 'false'"
        />
        <p v-if="errors.quantity" class="error">{{ errors.quantity }}</p>
      </div>

      <div class="field">
        <label class="label" for="order-total">
          Total price (USD) <span class="required">*</span>
        </label>
        <input
          id="order-total"
          v-model.number="form.totalPrice"
          class="input"
          type="number"
          min="0"
          step="0.01"
          :aria-invalid="errors.totalPrice ? 'true' : 'false'"
        />
        <p v-if="errors.totalPrice" class="error">{{ errors.totalPrice }}</p>
      </div>
    </div>

    <div class="field">
      <label class="label" for="order-status">Status</label>
      <select id="order-status" v-model="form.status" class="input">
        <option v-for="status in STATUSES" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </div>

    <div class="actions">
      <button type="button" class="secondary-button" @click="emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="primary-button">
        {{ isEditing ? 'Save changes' : 'Create order' }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.required {
  color: var(--color-danger);
}

.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--color-text);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: var(--color-border-strong);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
}

.error {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-danger);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.primary-button {
  display: inline-flex;
  align-items: center;
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
  transition: background-color 0.15s ease;

  &:hover {
    background: var(--color-primary-hover);
  }
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

@media (max-width: 480px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
