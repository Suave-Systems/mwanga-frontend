import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { InputComponent } from '../../../shared/components/input/input';
import { Auth } from '../../../shared/services/auth';
import { Helper } from '../../../shared/services/helper';
import { finalize, shareReplay, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Button, InputComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup = new FormGroup({});
  isLoading = signal(false);
  errorMessage: string = '';
  version = 'environment.version';
  hide: boolean = true;
  private authService = inject(Auth);
  private helperService = inject(Helper);
  private sub = new Subscription();

  private fb = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.helperService.validateAllFormFields(this.loginForm);
      return;
    }
    this.isLoading.set(true);
    this.sub = this.authService
      .login({ ...this.loginForm.value })
      .pipe(
        shareReplay(1),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          // const errormessage = err?.description;
          const errormessage = 'User details invalid';
          // todo: leave a message to the user toastr
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }
}
