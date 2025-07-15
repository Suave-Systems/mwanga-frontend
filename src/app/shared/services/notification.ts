import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  constructor() {}

  confirm(
    title: string,
    text = '',
    confirmButtonText = 'Yes',
    cancelButtonText = 'Cancel',
    confirmButtonClass = 'bg-primary text-white px-4 py-2 rounded focus:outline-none mr-2',
    cancelButtonClass = 'bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none',
    icon: SweetAlertIcon = 'warning'
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      customClass: {
        confirmButton: confirmButtonClass,
        cancelButton: cancelButtonClass,
      },
      buttonsStyling: false,
    });
  }

  toast(
    message: string,
    icon: SweetAlertIcon = 'success',
    position:
      | 'top-end'
      | 'top-start'
      | 'bottom-end'
      | 'bottom-start'
      | 'top'
      | 'center'
      | 'bottom' = 'top-end',
    duration = 3000
  ) {
    Swal.fire({
      toast: true,
      position,
      icon,
      title: message,
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      customClass: {
        popup: 'rounded-lg shadow-md bg-white border border-gray-200',
        title: 'text-sm text-gray-800',
      },
    });
  }

  showError(message: string, title = 'Error') {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
    });
  }

  showWarning(message: string, title = 'Warning') {
    Swal.fire({
      icon: 'warning',
      title,
      text: message,
    });
  }
}
