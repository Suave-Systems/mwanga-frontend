import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Category extends BaseService {
  constructor(http: HttpClient) {
    const url = `${environment.baseUrl}app/v1/category/`;
    super(http, url); // API endpoint base URL
  }
}
