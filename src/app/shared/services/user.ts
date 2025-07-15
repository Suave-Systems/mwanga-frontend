import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class User extends BaseService {
  private baseURI = environment.baseUrl;
  constructor(private http: HttpClient) {
    const url = `${environment.baseUrl}users/v1/users/`;

    super(http, `${url}`);
  }

  getRoles() {
    return this.http.get(`${this.baseURI}users/v1/users/user_type/`);
  }

  setNewPassword(payload: any) {
    return this.http.post(``, payload);
  }

  getUser() {
    return this.http.get(`${this.baseURI}users/v1/users/me/`);
  }
}
