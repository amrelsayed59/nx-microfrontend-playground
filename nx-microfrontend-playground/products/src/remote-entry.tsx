import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './app/app';

const roots = new WeakMap<HTMLElement, Root>();

export function mount(element: HTMLElement): () => void {
  const root = createRoot(element);
  root.render(createElement(App));
  roots.set(element, root);
  return () => {
    roots.get(element)?.unmount();
    roots.delete(element);
  };
}
