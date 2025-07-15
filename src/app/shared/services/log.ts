import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Log extends BaseService {
  constructor(http: HttpClient) {
    const url = `${environment.baseUrl}app/v1/log/`;
    super(http, url);
  }
}
