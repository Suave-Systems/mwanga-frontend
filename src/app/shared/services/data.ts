import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Data extends BaseService {
  constructor(http: HttpClient) {
    super(http, `https://mwanga-backend.onrender.com/app/v1/data/`); // API endpoint base URL
  }

  upload(payload: any) {
    return this.httpClient.post(
      'https://mwanga-backend.onrender.com/app/v1/data/upload/',
      payload
    );
  }
}
