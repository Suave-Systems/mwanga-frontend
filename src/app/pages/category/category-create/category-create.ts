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
import { Notification } from '../../../shared/services/notification';
import { Helper } from '../../../shared/services/helper';
import { finalize } from 'rxjs';

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
  private helperService = inject(Helper);
  private router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private notificationService: Notification
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      is_active: [],
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

  get is_active() {
    return this.form.get('is_active') as FormControl;
  }

  get columns() {
    return this.form.get('columns') as FormArray;
  }

  getById(id: string): void {
    this.categoryService.sendGetById(id).subscribe((category: any) => {
      this.form.patchValue({
        name: category.name,
        id: category.id,
        is_active: category.is_active,
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
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/main/category-list']);
        },
      });
  }

  onEdit() {
    this.categoryService
      .sendPatch<BaseCreateAPIResponse<CategoryCreateResponse>>(this.form.value)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/main/category-list']);
        },
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.helperService.validateAllFormFields(this.form);
      return;
    }
    this.isLoading.set(true);
    if (this.mode === 'new') {
      this.onSave();
      return;
    }
    this.onEdit();
  }

  onToggleCategory() {
    const title = this.is_active.value
      ? 'Deactivate Category'
      : 'Activate Category';
    this.notificationService
      .confirm(
        `${title} Category?`,
        `Are you sure you want to ${title} Category?`,
        title,
        'Cancel'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.is_active.patchValue(!this.is_active.value);
          this.onSubmit();
        }
      });
  }
}
