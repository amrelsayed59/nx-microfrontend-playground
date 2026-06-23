import { DestroyRef, Injectable, inject } from '@angular/core';
import { subscribeAppEvent } from '@org/shared-models';
import { NotificationService } from '../notifications/notification.service';

/**
 * Listens for cross-framework events published by remotes (React, and later
 * Vue) over the shared browser-event bus, and maps them to host-owned UI such
 * as notifications.
 *
 * The host never imports remote code — it only knows the typed event contract
 * from `@org/shared-models`. Adding a new event = adding one `subscribe` block.
 */
@Injectable({ providedIn: 'root' })
export class CrossFrameworkEventsService {
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  private initialized = false;

  /** Begin listening. Idempotent — safe to call more than once. */
  init(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    const unsubscribeProductCreated = subscribeAppEvent(
      'product-created',
      (detail) => {
        console.log('[host] received cross-framework event: product-created', detail);
        this.notifications.show(
          `Product "${detail.name}" created successfully`
        );
      }
    );

    const unsubscribeProductDeleted = subscribeAppEvent(
      'product-deleted',
      (detail) => {
        console.log('[host] received cross-framework event: product-deleted', detail);
        this.notifications.show(
          `Product "${detail.name}" deleted successfully`
        );
      }
    );

    // Unsubscribe when the root injector is destroyed.
    this.destroyRef.onDestroy(() => {
      unsubscribeProductCreated();
      unsubscribeProductDeleted();
    });
  }
}
