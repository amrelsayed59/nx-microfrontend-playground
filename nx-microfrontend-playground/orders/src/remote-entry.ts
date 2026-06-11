import { createApp } from 'vue';
import type { App as VueApp } from 'vue';
import App from './app/app.vue';

const apps = new WeakMap<HTMLElement, VueApp<Element>>();

export function mount(element: HTMLElement): () => void {
  const app = createApp(App);
  app.mount(element);
  apps.set(element, app);
  return () => {
    apps.get(element)?.unmount();
    apps.delete(element);
  };
}
