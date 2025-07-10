import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../shared/services/auth';
import { catchError, throwError } from 'rxjs';
import { Notification } from '../shared/services/notification';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const alertService = inject(Notification);

  const token = authService.getToken();

  // Always set Accept header
  req = req.clone({
    setHeaders: {
      Accept: 'application/json',
    },
  });

  // Add Authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // Extract useful error info
      const status = error.status;
      const message =
        error?.error?.message ||
        error?.message ||
        'An unexpected error occurred';

      // You can customize responses based on status
      if (status === 0) {
        alertService.toast(
          'Network error. Please check your connection.',
          'error'
        );
      } else if (status >= 400 && status < 500) {
        alertService.toast(message || 'Client error occurred.', 'error');
      } else if (status >= 500) {
        alertService.toast('Server error. Please try again later.', 'error');
      } else {
        alertService.toast(message, 'error');
      }

      return throwError(() => error);
    })
  );
};
