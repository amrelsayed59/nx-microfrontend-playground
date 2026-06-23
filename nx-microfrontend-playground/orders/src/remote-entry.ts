import { createApp } from 'vue';
import type { App as VueApp } from 'vue';
import App from './app/app.vue';
import { pinia } from './app/stores/pinia';

const apps = new WeakMap<HTMLElement, VueApp<Element>>();

export function mount(element: HTMLElement): () => void {
  // Same mount/unmount contract as before — Pinia is registered on the app
  // instance so the federated remote has its store, exactly like standalone.
  const app = createApp(App);
  app.use(pinia);
  app.mount(element);
  apps.set(element, app);
  return () => {
    apps.get(element)?.unmount();
    apps.delete(element);
  };
}
