import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Log } from '../../../shared/services/log';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { TableFilters } from '../../../shared/components/table-filters/table-filters';
import { DatePipe } from '@angular/common';
import { Button } from '../../../shared/components/button/button';
import { RouterLink } from '@angular/router';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { HasPermissionDirective } from '../../../core/directives/has-permission';

@Component({
  selector: 'app-log-list',
  imports: [
    Table,
    EmptyState,
    TableFilters,
    Button,
    RouterLink,
    Pagination,
    HasPermissionDirective,
  ],
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
    { key: 'file_name', label: 'File Name' },
    { key: 'total_uploaded', label: 'Total Uploaded' },
    { key: 'uploaded_by', label: 'Uploaded By' },
    { key: 'date_created', label: 'Date' },
  ];

  tableData = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  params: any;

  ngOnInit() {
    this.getDataList();
  }

  onSearchChange() {}

  getDataList() {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      page_size: this.itemsPerPage,
      ...this.params,
    };
    this.logService.sendGetAll<any>(params).subscribe({
      next: (res) => {
        this.tableData = res.results.filter((log: any) => {
          log.date_created =
            this.datePipe.transform(log.date_created, 'medium') || 'N/A';
          return log;
        });
        this.totalItems = res.count;
        this.isLoading = false;
        // console.log(res);
      },
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getDataList();
  }

  onApplyFilter(value: any) {
    this.params = value;
    this.params.is_active = value.filter;
    this.getDataList();
  }

  handleRowClick(row: any) {
    console.log('Row clicked:', row);
    // Perform navigation, open modal, etc.
  }
}
