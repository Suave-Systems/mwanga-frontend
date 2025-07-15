import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../shared/services/auth';
import { catchError, switchMap, throwError } from 'rxjs';
import { Notification } from '../shared/services/notification';
import { Cookie } from '../shared/services/cookie';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const cookieService = inject(Cookie);
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
      } else if (error.status === 401) {
        // Handle 401 Unauthorized
        const refreshToken = cookieService.get('refreshToken');
        if (!refreshToken) {
          alertService.showError(
            'Session expired. Please log in again.',
            'Authentication Error'
          );
          authService.logout();
          return throwError(() => error);
        }

        // Attempt to refresh token
        return authService.refreshToken(refreshToken).pipe(
          switchMap((newToken: { access: string }) => {
            authService.setToken(newToken.access); // Save new token
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken.access}`,
              },
            });
            return next(clonedReq); // Retry original request
          }),
          catchError((refreshError) => {
            alertService.showError(
              'Session expired. Please log in again.',
              'Authentication Error'
            );
            authService.logout();
            return throwError(() => refreshError);
          })
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
