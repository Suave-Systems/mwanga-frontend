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
import { InputComponent } from '../../../shared/components/input/input';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-data-list',
  imports: [Button, Select, InputComponent],
  templateUrl: './data-list.html',
  styleUrl: './data-list.scss',
})
export class DataList implements OnInit {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private dataService = inject(Data);
  private categoryService = inject(Category);
  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  tableData: any[] = [];
  categoryList: CategoryResponse[] = [];
  tableHeaders: any[] = [];

  ngOnInit() {
    this.getDataList();
    this.getCategoryList();

    this.form = this.fb.group({
      file: ['', [Validators.required]],
      categoryObject: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });

    this.categoryObject.valueChanges.subscribe((value) => {
      this.category.patchValue(value.id);
      this.category.updateValueAndValidity();
      this.tableHeaders = value.columns;
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

    // const reader = new FileReader();
    // reader.onload = () => {
    //   const base64 = (reader.result as string).split(',')[1]; // get base64 part only
    //   this.file.patchValue(base64);
    //   this.file.updateValueAndValidity();
    //   // Now you can send `uploadedFileBase64` to your backend
    // };
    // reader.readAsDataURL(file);
  }

  downloadTemplateWithHeaders(): void {
    const headers = this.tableHeaders;

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

  onSubmit() {
    const form = this.form.value;
    const data = new FormData();
    data.append('category', form.category);
    data.append('file', form.file, 'file');
    this.dataService.upload(data).subscribe({
      next: (res) => {
        alert('data uploaded successfully');
      },
    });
  }

  getCategoryList() {
    this.categoryService
      .sendGetAll<BaseAPIResponse<CategoryResponse[]>>()
      .subscribe({
        next: (res) => {
          this.categoryList = res.results;
          // console.log(res);
        },
      });
  }

  getDataList() {
    this.dataService.sendGetAll<BaseAPIResponse<any[]>>().subscribe({
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
