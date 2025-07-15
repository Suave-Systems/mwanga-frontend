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
import { Notification } from '../../../shared/services/notification';
import { Button } from '../../../shared/components/button/button';
import { Select } from '../../../shared/components/select/select';
import { InputComponent } from '../../../shared/components/input/input';

@Component({
  selector: 'app-profile',
  imports: [Button, InputComponent, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  errorMessage = '';
  isLoading = signal(false);

  private userService = inject(User);
  private router = inject(Router);
  constructor(private notificationService: Notification) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });

    this.getUser();
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

  getUser(): void {
    this.userService.getUser().subscribe((user: any) => {
      console.log(user);

      const { email, id, first_name, last_name, is_active } = user.data;
      this.form.patchValue({
        email: email,
        id: id,
        first_name: first_name,
        last_name: last_name,
        is_active: is_active,
      });
      this.form.updateValueAndValidity();
    });
  }

  onSubmit() {
    this.userService
      .sendPatch<BaseCreateAPIResponse<any>>(this.form.value)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/main/dashboard']);
        },
      });
  }
}
