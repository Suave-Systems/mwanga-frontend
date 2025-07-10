import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../shared/services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from '../../../shared/services/notification';
import { Button } from '../../../shared/components/button/button';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword implements OnInit {
  form!: FormGroup;
  passwordForm!: FormGroup;
  private fb = inject(FormBuilder);
  errorMessage = '';
  isLoading = signal(false);
  hide = true;
  userRoles: any[] = [];
  mode: 'create' | 'edit' = 'create';

  private userService = inject(User);
  private router = inject(Router);
  constructor(private notificationService: Notification) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    });
    // this.getById()
  }

  get new_password() {
    return this.passwordForm.get('password') as FormControl;
  }

  get confirm_password() {
    return this.passwordForm.get('confirm_password') as FormControl;
  }

  getById(id: string): void {
    this.userService.sendGetById(id).subscribe((user: any) => {
      const { email, id, first_name, last_name, user_type, is_active } = user;
      this.form.patchValue({
        email: email,
        id: id,
        first_name: first_name,
        last_name: last_name,
        is_active: is_active,
        user_type: user_type.user_type,
      });
      this.form.updateValueAndValidity();

      this.passwordForm.get('email')?.patchValue(user.email);
      this.passwordForm.updateValueAndValidity();
    });
  }

  onSetNewPassword() {
    this.userService.setNewPassword(this.passwordForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/main/dashboard']);
        this.notificationService.toast('Password change successful', 'success');
      },
    });
  }
}
