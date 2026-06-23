import { createPinia } from 'pinia';

/**
 * Single module-level Pinia instance, shared across every mount of the remote
 * (standalone bootstrap and every federated `mount()` call). This mirrors the
 * React remote's single module-level Redux store: all instances of the orders
 * feature observe the same state.
 */
export const pinia = createPinia();
