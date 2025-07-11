import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private _permissions = signal<string[]>([]);

  get permissions() {
    return this._permissions();
  }

  hasPermission(permission: string) {
    return this._permissions().includes(permission);
  }

  hasAnyPermission(...permissions: string[]) {
    return permissions.some((p) => this.hasPermission(p));
  }

  setPermissions(permissions: string[]) {
    this._permissions.set(permissions);
    localStorage.setItem('user_permissions', JSON.stringify(permissions));
  }

  loadPermissionsFromStorage() {
    const storedPermissions = localStorage.getItem('user_permissions');

    if (storedPermissions) {
      this._permissions.set(JSON.parse(storedPermissions));
    }
  }

  clearPermissions() {
    this._permissions.set([]);
    localStorage.removeItem('user_permissions');
  }
}
