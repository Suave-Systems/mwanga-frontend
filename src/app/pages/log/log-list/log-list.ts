import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Log } from '../../../shared/services/log';

@Component({
  selector: 'app-log-list',
  imports: [Table],
  templateUrl: './log-list.html',
  styleUrl: './log-list.scss',
})
export class LogList {
  private logService = inject(Log);
  tableColumns = [
    { key: 'category', label: 'Category' },
    { key: 'total_uploaded', label: 'Total Uploaded' },
    { key: 'uploaded_by', label: 'Uploaded By' },
  ];

  tableData = [];

  ngOnInit() {
    this.getLogList();
  }

  getLogList() {
    this.logService.sendGetAll<any>().subscribe({
      next: (res) => {
        this.tableData = res.data;
        // console.log(res);
      },
    });
  }

  handleRowClick(row: any) {
    console.log('Row clicked:', row);
    // Perform navigation, open modal, etc.
  }
}
