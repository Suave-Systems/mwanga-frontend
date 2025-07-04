import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { InputComponent } from '../../../shared/components/input/input';
import { Category } from '../../../shared/services/category';
import {
  BaseCreateAPIResponse,
  CategoryCreateRequest as CategoryCreateResponse,
} from '../../../core/model/model.ts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule, Button, InputComponent],
  templateUrl: './category-create.html',
  styleUrl: './category-create.scss',
})
export class CategoryCreate implements OnInit {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  errorMessage = '';
  isLoading = signal(false);
  private categoryService = inject(Category);
  private router = inject(Router);

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      columns: this.fb.array([]),
    });
    this.addColumn();
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  get columns() {
    return this.form.get('columns') as FormArray;
  }

  addColumn() {
    this.columns.push(this.fb.control(''));
  }

  getColumn(i: any) {
    return this.columns.controls[i] as FormControl;
  }

  onSubmit() {
    console.log(this.form.value);

    this.categoryService
      .sendPost<BaseCreateAPIResponse<CategoryCreateResponse>>(this.form.value)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/main/category-list']);
        },
      });
  }
}
