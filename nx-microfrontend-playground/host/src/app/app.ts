import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppHeader } from './app-header/app-header';

@Component({
  imports: [RouterModule, AppHeader],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
