import { Injectable, signal } from '@angular/core';

export interface AppNotification {
  id: number;
  message: string;
}

/**
 * Lightweight, dependency-free notification store. Holds the active toasts in
 * a signal; each is auto-dismissed after `AUTO_HIDE_MS`.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private static readonly AUTO_HIDE_MS = 3000;

  private readonly _notifications = signal<AppNotification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  private nextId = 0;

  show(message: string): void {
    const id = this.nextId++;
    this._notifications.update((list) => [...list, { id, message }]);
    setTimeout(() => this.dismiss(id), NotificationService.AUTO_HIDE_MS);
  }

  dismiss(id: number): void {
    this._notifications.update((list) =>
      list.filter((notification) => notification.id !== id)
    );
  }
}
