import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { RouterLink } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { User } from '../../../shared/services/user';
import { TableFilters } from '../../../shared/components/table-filters/table-filters';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { CommonModule, DatePipe } from '@angular/common';
import { MatMenu } from '@angular/material/menu';

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
  ],
  providers: [DatePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
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
  selectedUser: any;
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
          user.last_login =
            this.datePipe.transform(user.last_login, 'mediumDate') ||
            'Not available';
          user.last_upload_date =
            this.datePipe.transform(user.last_upload_date, 'mediumDate') ||
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
    console.log('Row clicked:', row);
    // Perform navigation, open modal, etc.
  }
}
