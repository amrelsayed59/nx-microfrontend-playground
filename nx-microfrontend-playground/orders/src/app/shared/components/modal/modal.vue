<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

// `props` is referenced so the title is read reactively in the template.
void props;

function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <div
    class="overlay"
    role="dialog"
    aria-modal="true"
    :aria-label="title"
    @click="emit('close')"
  >
    <div class="panel" @click.stop>
      <header class="header">
        <h2 class="title">{{ title }}</h2>
        <button
          type="button"
          class="close"
          aria-label="Close dialog"
          @click="emit('close')"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </header>
      <div class="body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: rgb(0 0 0 / 0.4);
}

.panel {
  width: 100%;
  max-width: 480px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  max-height: calc(100vh - var(--space-8));
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.close {
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

.body {
  padding: var(--space-5);
  overflow-y: auto;
}
</style>
