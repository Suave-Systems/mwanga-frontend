import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../../shared/services/permission';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionsService
  ) {}

  @Input() set appHasPermission(permissions: string | string[]) {
    const hasAccess = Array.isArray(permissions)
      ? this.permissionService.hasAnyPermission(...permissions)
      : this.permissionService.hasPermission(permissions);

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
