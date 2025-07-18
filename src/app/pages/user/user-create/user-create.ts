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
import { BaseCreateAPIResponse } from '../../../core/model/model.ts';
import { InputComponent } from '../../../shared/components/input/input';
import { Button } from '../../../shared/components/button/button';
import { Select } from '../../../shared/components/select/select';
import { Notification } from '../../../shared/services/notification';
import { HasPermissionDirective } from '../../../core/directives/has-permission';

@Component({
  selector: 'app-user-create',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    Button,
    Select,
    HasPermissionDirective,
  ],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss',
})
export class UserCreate implements OnInit {
  form!: FormGroup;
  passwordForm!: FormGroup;
  private fb = inject(FormBuilder);
  errorMessage = '';
  isLoadingUserInfo = signal(false);
  isUpdatingUser = signal(false);
  isSettingPassword = signal(false);
  isLoadingRoles = signal(false);
  hide = true;
  userRoles: any[] = [];
  mode: 'create' | 'edit' = 'create';

  private userService = inject(User);
  private router = inject(Router);
  constructor(
    private route: ActivatedRoute,
    private notificationService: Notification
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      user_type: ['', [Validators.required]],
      is_active: ['', [Validators.required]],
    });
    this.passwordForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    });
    this.getRoles();
    this.checkMode();
  }

  checkMode() {
    const id = this.route.snapshot.paramMap.get('id');
    this.mode = id ? 'edit' : 'create';

    if (this.mode === 'edit' && id) {
      this.getById(id);
      return;
    }
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
  get is_active() {
    return this.form.get('is_active') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  get user_type() {
    return this.form.get('user_type') as FormControl;
  }

  get new_password() {
    return this.passwordForm.get('password') as FormControl;
  }

  get confirm_password() {
    return this.passwordForm.get('confirm_password') as FormControl;
  }

  getById(id: string): void {
    this.isLoadingUserInfo.set(true);
    this.userService.sendGetById(id).subscribe(
      (user: any) => {
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
        this.isLoadingUserInfo.set(false);
        this.passwordForm.get('email')?.patchValue(user.email);
        this.passwordForm.updateValueAndValidity();
      },
      (err) => {
        this.isLoadingUserInfo.set(false);
        this.notificationService.toast('Failed to load user details', 'error');
      }
    );
  }

  getRoles() {
    this.isLoadingRoles.set(true);
    this.userService.getRoles().subscribe({
      next: (res: any) => {
        this.isLoadingRoles.set(false);
        this.userRoles = res.data;
      },
      error: (err) => {
        this.isLoadingRoles.set(false);
        this.notificationService.toast('Failed to load user roles', 'error');
      },
    });
  }

  onSave() {
    this.isUpdatingUser.set(true);
    this.userService
      .sendPost<BaseCreateAPIResponse<any>>(this.form.value)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/main/user-list']);
          this.isUpdatingUser.set(false);
          this.notificationService.toast(
            'User created successfully',
            'success'
          );
        },
        error: (err) => {
          this.isUpdatingUser.set(false);
          this.notificationService.toast('Failed to create user', 'error');
        },
      });
  }
  onUpdate() {
    this.isUpdatingUser.set(true);
    this.userService
      .sendPatch<BaseCreateAPIResponse<any>>(this.form.value)
      .subscribe({
        next: (res) => {
          this.isUpdatingUser.set(false);
          this.notificationService.toast(
            'User updated successfully',
            'success'
          );
          this.router.navigate(['/main/user-list']);
        },
        error: (err) => {
          this.isUpdatingUser.set(false);
          this.notificationService.toast('Failed to update user', 'error');
        },
      });
  }

  onSubmit() {
    if (this.mode === 'create') {
      this.onSave();
      return;
    }
    this.onUpdate();
  }

  onSetNewPassword() {
    this.isSettingPassword.set(true);
    this.userService.setNewPassword(this.passwordForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/main/user-list']);
        this.isSettingPassword.set(false);
        this.notificationService.toast('Password change successful', 'success');
      },
      error: (err) => {
        this.isSettingPassword.set(false);
        this.notificationService.toast('Failed to set new password', 'error');
      },
    });
  }

  onToggleUser() {
    this.isUpdatingUser.set(true);
    const title = this.is_active.value ? 'Deactivate User' : 'Activate User';
    this.notificationService
      .confirm(
        `${title} User?`,
        `Are you sure you want to ${title} User?`,
        title,
        'Cancel',
        this.is_active.value
          ? 'bg-red-500 text-white py-2 px-4 text-white rounded mr-2'
          : 'bg-primary text-white px-4 py-2 rounded mr-2'
      )
      .then((result) => {
        if (result.isConfirmed) {
          // Do something irreversible
          this.is_active.patchValue(!this.is_active.value);
          this.onSubmit();
          return;
        }
        this.isUpdatingUser.set(false);
      });
  }
}
