import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Log } from '../../../shared/services/log';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { TableFilters } from '../../../shared/components/table-filters/table-filters';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-log-list',
  imports: [Table, EmptyState, TableFilters],
  providers: [DatePipe],
  templateUrl: './log-list.html',
  styleUrl: './log-list.scss',
})
export class LogList {
  private logService = inject(Log);
  private datePipe = inject(DatePipe);
  isLoading = false;
  tableColumns = [
    { key: 'category', label: 'Category' },
    { key: 'total_uploaded', label: 'Total Uploaded' },
    { key: 'uploaded_by', label: 'Uploaded By' },
    { key: 'date_created', label: 'Date' },
  ];

  tableData = [];
  params: any;

  ngOnInit() {
    this.getDataList();
  }

  onSearchChange() {}
  onApplyFilter(value: any) {
    this.params = value;
    this.params.is_active = value.filter;
    this.getDataList();
  }

  getDataList() {
    this.isLoading = true;
    this.logService.sendGetAll<any>(this.params).subscribe({
      next: (res) => {
        this.tableData = res.data.filter((log: any) => {
          log.date_created =
            this.datePipe.transform(log.date_created, 'mediumDate') || 'N/A';
          return log;
        });
        this.isLoading = false;
        // console.log(res);
      },
    });
  }

  handleRowClick(row: any) {
    console.log('Row clicked:', row);
    // Perform navigation, open modal, etc.
  }
}
