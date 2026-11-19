import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from '../layout/nav/nav';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

@Component({
  imports: [RouterOutlet, Nav, ConfirmDialog],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected router = inject(Router);
}
