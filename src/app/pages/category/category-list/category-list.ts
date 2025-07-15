import { Component, inject, ViewChild } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Button } from '../../../shared/components/button/button';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../../../shared/services/category';
import {
  BaseAPIResponse,
  CategoryResponse,
} from '../../../core/model/model.ts';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input';
import { TableFilters } from '../../../shared/components/table-filters/table-filters';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { HasPermissionDirective } from '../../../core/directives/has-permission';
import { PermissionsService } from '../../../shared/services/permission';

@Component({
  selector: 'app-category-list',
  imports: [
    Table,
    Button,
    RouterLink,
    FormsModule,
    MatMenuModule,
    TableFilters,
    Pagination,
    EmptyState,
    HasPermissionDirective,
  ],
  providers: [DatePipe],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList {
  private categoryService = inject(Category);
  private permissionService = inject(PermissionsService);
  private datePipe = inject(DatePipe);
  private router = inject(Router);
  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'user', label: 'Created By' },
    { key: 'status', label: 'Status' },
    { key: 'last_modified', label: 'Last Modified' },
    { key: 'last_upload_count', label: 'Last Upload Count' },
    { key: 'total_uploads', label: 'Total Uploads' },
  ];

  isActiveArray: any[] = [
    {
      name: 'All',
      value: null,
    },
    {
      name: 'Is Active',
      value: true,
    },
    {
      name: 'Is In-Active',
      value: false,
    },
  ];

  tableData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  search = '';
  selectedCategory: any;
  params: any = {};

  isLoading = false;

  ngOnInit() {
    this.getDataList();
  }

  onSearchChange() {}

  downloadTemplateWithHeaders(): void {
    const headers: any[] = this.selectedCategory.columns;

    // Convert header array to worksheet by using an array of objects with empty values
    const emptyRow = headers.reduce((acc, header) => {
      acc[header] = '';
      return acc;
    }, {} as Record<string, any>);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([emptyRow], {
      skipHeader: false,
    });

    // Remove the first data row to leave only the headers
    const range = XLSX.utils.decode_range(worksheet['!ref'] || '');
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        delete worksheet[cellAddress];
      }
    }
    worksheet['!ref'] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: 0, c: headers.length - 1 },
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { Template: worksheet },
      SheetNames: ['Template'],
    };

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template.xlsx';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  getDataList() {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      page_size: this.itemsPerPage,
      ...this.params,
    };
    this.categoryService
      .sendGetAll<BaseAPIResponse<CategoryResponse[]>>(params)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.totalItems = res.count;
          this.tableData = res.results.map((category: any) => {
            category.status = category.is_active ? 'active' : 'inactive';
            category.last_modified = this.datePipe.transform(
              category.last_modified,
              'medium'
            );
            return category;
          });
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

  handleMenuOptions(row: any) {
    this.selectedCategory = row;
  }

  handleRowClick(row: any) {
    const hasPermission = this.permissionService.hasPermission(
      'app.can_update_category'
    );
    hasPermission && this.router.navigate(['/main/category-edit', row?.id]);
  }
}
