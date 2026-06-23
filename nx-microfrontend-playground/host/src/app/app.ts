import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppHeader } from './app-header/app-header';
import { CrossFrameworkEventsService } from './events/cross-framework-events.service';
import { NotificationsComponent } from './notifications/notifications.component';

@Component({
  imports: [RouterModule, AppHeader, NotificationsComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly events = inject(CrossFrameworkEventsService);

  ngOnInit(): void {
    this.events.init();
  }
}
