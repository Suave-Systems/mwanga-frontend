import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Button } from '../../../shared/components/button/button';
import { RouterLink } from '@angular/router';
import { Category } from '../../../shared/services/category';
import {
  BaseAPIResponse,
  CategoryResponse,
} from '../../../core/model/model.ts';

@Component({
  selector: 'app-category-list',
  imports: [Table, Button, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList {
  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'total_uploads', label: 'Total Uploads' },
  ];

  tableData: any[] = [];

  private categoryService = inject(Category);

  ngOnInit() {
    this.getCategoryList();
  }

  getCategoryList() {
    this.categoryService
      .sendGetAll<BaseAPIResponse<CategoryResponse[]>>()
      .subscribe({
        next: (res) => {
          this.tableData = res.results;
          // console.log(res);
        },
      });
  }

  handleRowClick(row: any) {
    console.log('Row clicked:', row);
    // Perform navigation, open modal, etc.
  }
}
