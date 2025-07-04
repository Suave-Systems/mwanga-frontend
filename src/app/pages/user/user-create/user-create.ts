import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../shared/services/user';
import { Router } from '@angular/router';
import { BaseCreateAPIResponse } from '../../../core/model/model.ts';
import { InputComponent } from '../../../shared/components/input/input';
import { Button } from '../../../shared/components/button/button';
import { Select } from '../../../shared/components/select/select';

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule, InputComponent, Button, Select],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss',
})
export class UserCreate implements OnInit {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  errorMessage = '';
  isLoading = signal(false);
  private userService = inject(User);
  private router = inject(Router);
  hide = true;
  userRoles: any[] = [];

  ngOnInit() {
    this.form = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      user_type: ['', [Validators.required]],
    });
    this.getRoles();
  }

  get first_name() {
    return this.form.get('first_name') as FormControl;
  }

  get last_name() {
    return this.form.get('last_name') as FormControl;
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  get user_type() {
    return this.form.get('user_type') as FormControl;
  }

  getRoles() {
    this.userService.getRoles().subscribe({
      next: (res: any) => {
        this.userRoles = res.data;
      },
    });
  }

  onSubmit() {
    this.userService
      .sendPost<BaseCreateAPIResponse<any>>(this.form.value)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/main/user-list']);
        },
      });
  }
}
