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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule, Button, InputComponent],
  templateUrl: './category-create.html',
  styleUrl: './category-create.scss',
})
export class CategoryCreate implements OnInit {
  form!: FormGroup;
  errorMessage = '';
  isLoading = signal(false);
  mode: 'new' | 'edit' = 'new';

  private fb = inject(FormBuilder);
  private categoryService = inject(Category);
  private router = inject(Router);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      columns: this.fb.array([]),
    });
    this.checkMode();
  }

  checkMode() {
    const id = this.route.snapshot.paramMap.get('id');
    this.mode = id ? 'edit' : 'new';

    if (this.mode === 'edit' && id) {
      this.getById(id);
      return;
    }

    this.addColumn();
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  get columns() {
    return this.form.get('columns') as FormArray;
  }

  getById(id: string): void {
    this.categoryService.sendGetById(id).subscribe((category: any) => {
      this.form.patchValue({
        name: category.name,
        id: category.id,
      });

      // Populate columns if available
      const columnsArray = this.form.get('columns') as FormArray;
      columnsArray.clear();
      if (Array.isArray(category.columns)) {
        category.columns.forEach((col: any) => {
          columnsArray.push(this.fb.control(col));
        });
      }
    });
  }

  addColumn() {
    this.columns.push(this.fb.control(''));
  }

  getColumn(i: any) {
    return this.columns.controls[i] as FormControl;
  }

  onSave() {
    this.categoryService
      .sendPost<BaseCreateAPIResponse<CategoryCreateResponse>>(this.form.value)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/main/category-list']);
        },
      });
  }

  onEdit() {
    this.categoryService
      .sendPatch<BaseCreateAPIResponse<CategoryCreateResponse>>(this.form.value)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/main/category-list']);
        },
      });
  }

  onSubmit() {
    if (this.mode === 'new') {
      this.onSave();
      return;
    }
    this.onEdit();
  }
}
