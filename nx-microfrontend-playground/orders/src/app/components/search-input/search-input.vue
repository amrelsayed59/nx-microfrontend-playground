<script setup lang="ts">
const model = defineModel<string>({ required: true });

defineProps<{
  placeholder?: string;
  ariaLabel?: string;
}>();
</script>

<template>
  <div class="wrapper">
    <svg
      class="icon"
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
    <input
      v-model="model"
      type="search"
      class="input"
      :placeholder="placeholder ?? 'Search…'"
      :aria-label="ariaLabel ?? 'Search'"
    />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 320px;
}

.icon {
  position: absolute;
  left: var(--space-3);
  color: var(--color-text-muted);
  pointer-events: none;
}

.input {
  width: 100%;
  height: 38px;
  padding: 0 var(--space-3) 0 var(--space-7);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--color-text);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:hover {
    border-color: var(--color-border-strong);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }
}
</style>
