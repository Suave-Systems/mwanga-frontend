import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Data extends BaseService {
  private baseURI = environment.baseUrl;
  constructor(http: HttpClient) {
    const url = `${environment.baseUrl}app/v1/data/`;
    super(http, url);
  }

  upload(payload: any) {
    return this.httpClient.post(`${this.baseURI}app/v1/data/upload/`, payload);
  }
}
