import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../shared/services/auth';
import { InputComponent } from '../../../shared/components/input/input';
import { Button } from '../../../shared/components/button/button';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, InputComponent, Button],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  form: FormGroup = new FormGroup({});
  isLoading = false;
  errorMessage = '';

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  constructor() {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form = this.fb.group({
      email: ['', []],
    });
  }

  get emailAddress() {
    return this.form.get('email') as FormControl;
  }

  onResetPassword() {
    this.errorMessage = '';
    if (this.form.invalid) {
      return;
    }
    this.authService.forgotPassword(this.emailAddress.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err as string;
        // Todo: Display error message for user to see
      },
    });
  }
}
