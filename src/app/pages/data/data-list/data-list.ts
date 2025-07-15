import { Component, inject, OnInit } from '@angular/core';
import { Data } from '../../../shared/services/data';
import {
  BaseAPIResponse,
  CategoryResponse,
} from '../../../core/model/model.ts';
import { Button } from '../../../shared/components/button/button';
import { Category } from '../../../shared/services/category';
import { Select } from '../../../shared/components/select/select';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as XLSX from 'xlsx';
import { Notification } from '../../../shared/services/notification';
import { finalize } from 'rxjs';
import { Helper } from '../../../shared/services/helper';
import { HasPermissionDirective } from '../../../core/directives/has-permission';

@Component({
  selector: 'app-data-list',
  imports: [Button, Select, HasPermissionDirective],
  templateUrl: './data-list.html',
  styleUrl: './data-list.scss',
})
export class DataList implements OnInit {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private dataService = inject(Data);
  private categoryService = inject(Category);
  private alertService = inject(Notification);
  private helperService = inject(Helper);

  categoryList: CategoryResponse[] = [];
  isUploading = false;
  isGettingCategories = true;

  ngOnInit() {
    this.getCategoryList();

    this.form = this.fb.group({
      file: ['', [Validators.required]],
      categoryObject: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });

    this.categoryObject.valueChanges.subscribe((value) => {
      this.category.patchValue(value.id);
      this.category.updateValueAndValidity();
    });
  }

  get file() {
    return this.form.get('file') as FormControl;
  }

  get category() {
    return this.form.get('category') as FormControl;
  }

  get categoryObject() {
    return this.form.get('categoryObject') as FormControl;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.file.patchValue(file);
  }

  downloadTemplateWithHeaders(): void {
    const { columns, name } = this.categoryObject.value;

    // Convert header array to worksheet by using an array of objects with empty values
    const emptyRow = columns.reduce((acc: any, header: any) => {
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
      e: { r: 0, c: columns.length - 1 },
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
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
    this.alertService.toast('Template Download Successful');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.helperService.validateAllFormFields(this.form);
      return;
    }
    this.isUploading = true;
    const form = this.form.value;
    const data = new FormData();
    data.append('category', form.category);
    data.append('file', form.file, form.file.name);

    this.dataService
      .upload(data)
      .pipe(finalize(() => (this.isUploading = false)))
      .subscribe({
        next: (res: any) => {
          this.alertService.toast(res.message, 'success');
          // alert('data uploaded successfully');
        },
      });
  }

  getCategoryList() {
    this.isGettingCategories = true;
    const params: any = { is_active: true };
    this.categoryService
      .sendGetAll<BaseAPIResponse<CategoryResponse[]>>(params)
      .pipe(finalize(() => (this.isGettingCategories = false)))
      .subscribe({
        next: (res) => {
          this.isGettingCategories = false;
          this.categoryList = res.results;
          // console.log(res);
        },
      });
  }
}
