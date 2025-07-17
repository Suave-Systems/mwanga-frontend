import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { User } from '../../../shared/services/user';
import { TableFilters } from '../../../shared/components/table-filters/table-filters';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { CommonModule, DatePipe } from '@angular/common';
import { MatMenu } from '@angular/material/menu';
import { HasPermissionDirective } from '../../../core/directives/has-permission';
import { PermissionsService } from '../../../shared/services/permission';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    Table,
    Button,
    RouterLink,
    TableFilters,
    EmptyState,
    MatMenu,
    HasPermissionDirective,
  ],
  providers: [DatePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'date_created', label: 'Date Joined' },
    { key: 'last_login', label: 'Last Login' },
    { key: 'user_type', label: 'Role' },
    { key: 'last_upload_date', label: 'Date of Last Upload' },
    { key: 'last_upload_count', label: 'Last Upload Count' },
    { key: 'last_uploaded_category', label: 'Last Upload Category' },
    { key: 'total_uploaded', label: 'Total Uploads' },
    { key: 'status', label: 'Status' },
  ];

  tableData = [];
  userRoles: any[] = [];
  params: any;
  isLoading = false;
  private userService = inject(User);
  private datePipe = inject(DatePipe);
  private permissionService = inject(PermissionsService);
  selectedUser: any;
  private router = inject(Router);
  // constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.getDataList();
    this.getRoles();
  }

  onApplyFilter(value: any) {
    this.params = value;
    this.params.user_type = value.filter;
    this.getDataList();
  }

  getDataList() {
    this.isLoading = true;
    this.userService.sendGetAll<any>(this.params).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.tableData = res.results.map((user: any) => {
          user.name = `${user.first_name} ${user.last_name}`;
          user.status = user.is_active ? 'active' : 'inactive';
          user.user_type = user?.user_type?.user_type_name || 'N/A';
          user.date_created =
            this.datePipe.transform(user.date_created, 'medium') ||
            'Not available';
          user.last_login =
            this.datePipe.transform(user.last_login, 'medium') ||
            'Not available';
          user.last_upload_date =
            this.datePipe.transform(user.last_upload_date, 'medium') ||
            'Not available';
          return user;
        });
        // console.log(res);
      },
    });
  }

  getRoles() {
    this.userService.getRoles().subscribe({
      next: (res: any) => {
        this.userRoles = res.data;
      },
    });
  }

  onMenuOpened(selectedUser: any) {
    this.selectedUser = selectedUser;
  }

  handleRowClick(row: any) {
    const hasPermission = this.permissionService.hasPermission(
      'users.can_update_users'
    );
    hasPermission && this.router.navigate(['/main/user-edit', row.id]);
    // Perform navigation, open modal, etc.
  }

  // onToggleUser() {
  //   const hasPermission = this.permissionService.hasPermission(
  //     'users.can_update_users'
  //   );
  //   const { id, is_active } = this.selectedUser;
  //   const value = confirm(
  //     `Are you sure you want to ${is_active ? 'Deactivate' : 'Activate'} User`
  //   );

  //   if (value && hasPermission) {
  //     // this.selectedUser.is_active = !this.selectedUser.is_active;
  //     this.userService.sendPatch({ id, is_active: !is_active }).subscribe({
  //       next: (res) => {
  //         this.getDataList();
  //       },
  //     });
  //   }
  // }
}
