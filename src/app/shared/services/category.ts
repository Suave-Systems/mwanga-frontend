import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Category extends BaseService {
  constructor(http: HttpClient) {
    super(http, `https://mwanga-backend.onrender.com/app/v1/category/`); // API endpoint base URL
  }
}
