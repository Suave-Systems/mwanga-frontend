import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { RouterLink } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { User } from '../../../shared/services/user';

@Component({
  selector: 'app-user-list',
  imports: [Table, Button, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'user_type', label: 'Role' },
  ];

  tableData = [];

  private userService = inject(User);

  ngOnInit() {
    this.getLogList();
  }

  getLogList() {
    this.userService.sendGetAll<any>().subscribe({
      next: (res) => {
        this.tableData = res.results.map((user: any) => {
          user.name = `${user.first_name} ${user.last_name}`;
          return user;
        });
        // console.log(res);
      },
    });
  }

  handleRowClick(row: any) {
    console.log('Row clicked:', row);
    // Perform navigation, open modal, etc.
  }
}
