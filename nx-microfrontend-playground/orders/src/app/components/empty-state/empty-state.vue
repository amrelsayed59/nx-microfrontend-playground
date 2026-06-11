<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="container" role="status">
    <div class="icon" aria-hidden="true">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M16 16h6" />
        <path d="M19 13v6" />
        <path
          d="M12 13.5V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h7.5"
        />
        <path d="M2 10h10" />
      </svg>
    </div>
    <h3 class="title">{{ title }}</h3>
    <p class="description">{{ description }}</p>
    <div v-if="$slots['action']" class="action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-8) var(--space-5);
  background: var(--color-surface);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
}

.icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--color-bg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.title {
  margin: 0 0 var(--space-2);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.description {
  margin: 0;
  max-width: 360px;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.action {
  margin-top: var(--space-4);
}
</style>
