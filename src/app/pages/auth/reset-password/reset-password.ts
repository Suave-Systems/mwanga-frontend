import { Component, inject } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from '../../../shared/services/auth';
import { shareReplay, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Helper } from '../../../shared/services/helper';
import { InputComponent } from '../../../shared/components/input/input';

@Component({
  selector: 'app-reset-password',
  imports: [Button, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  form: FormGroup = new FormGroup({});
  isLoading: boolean = false;
  errorMessage: string = '';
  version = 'environment.version';
  hidePassword: boolean = true;
  private authService = inject(Auth);
  private helperService = inject(Helper);
  private sub = new Subscription();

  private fb = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form = this.fb.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.helperService.passwordMatch(
          'password',
          'confirmPassword'
        ),
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get confirmPassword() {
    return this.form.get('confirmPassword') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  onLogin() {
    if (this.form.invalid) {
      this.helperService.validateAllFormFields(this.form);
      return;
    }
    this.isLoading = true;
    this.sub = this.authService
      .login({ ...this.form.value })
      .pipe(shareReplay(1))
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          // const errormessage = err?.description;
          const errormessage = 'User details invalid';
          // todo: leave a message to the user toastr
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
