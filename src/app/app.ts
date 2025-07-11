import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PermissionsService } from './shared/services/permission';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(private permissionStore: PermissionsService) {
    this.permissionStore.loadPermissionsFromStorage();
  }
}
