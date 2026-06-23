/**
 * Cross-framework event contract.
 *
 * A tiny, framework-agnostic event bus built on native browser CustomEvents.
 * Producers (any remote) call `publishAppEvent`; consumers (the host, or
 * another remote) call `subscribeAppEvent`. Neither side imports the other —
 * they only share this typed contract, which is why it lives in the shared
 * models library.
 *
 * To add a new cross-framework event, add one line to `AppEventMap`. Both the
 * publish and subscribe sides become type-checked against it automatically.
 */
export interface AppEventMap {
  'product-created': { id: number; name: string };
  'product-updated': { id: number; name: string };
  'product-deleted': { id: number; name: string };
  'order-created': { id: string };
  // Auth lifecycle. Payload is primitive so this contract stays decoupled from
  // the user model; subscribers re-read the session for details.
  'auth-changed': { authenticated: boolean };
}

export type AppEventName = keyof AppEventMap;

/**
 * Publish a cross-framework event on the global `window`. The payload type is
 * inferred from the event name, so callers cannot send the wrong shape.
 */
export function publishAppEvent<K extends AppEventName>(
  name: K,
  detail: AppEventMap[K]
): void {
  window.dispatchEvent(new CustomEvent<AppEventMap[K]>(name, { detail }));
}

/**
 * Subscribe to a cross-framework event. Returns an unsubscribe function — call
 * it on teardown (component destroy, etc.) to remove the listener.
 */
export function subscribeAppEvent<K extends AppEventName>(
  name: K,
  handler: (detail: AppEventMap[K]) => void
): () => void {
  const listener = (event: Event): void => {
    handler((event as CustomEvent<AppEventMap[K]>).detail);
  };
  window.addEventListener(name, listener);
  return () => window.removeEventListener(name, listener);
}
