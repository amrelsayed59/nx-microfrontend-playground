import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentUser = this.auth.currentUser;
  protected readonly isAuthenticated = this.auth.isAuthenticated;

  protected readonly userInitials = computed(() => {
    const name = this.currentUser()?.username ?? '';
    return name.slice(0, 2).toUpperCase();
  });

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
