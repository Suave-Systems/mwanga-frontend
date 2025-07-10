import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class User extends BaseService {
  constructor(private http: HttpClient) {
    super(http, `https://mwanga-backend.onrender.com/users/v1/users/`);
  }

  getRoles() {
    return this.http.get(
      `https://mwanga-backend.onrender.com/users/v1/users/user_type/`
    );
  }

  setNewPassword(payload: any) {
    return this.http.post(``, payload);
  }

  getUser() {
    return this.http.get(
      'https://mwanga-backend.onrender.com/users/v1/users/me/'
    );
  }
}
