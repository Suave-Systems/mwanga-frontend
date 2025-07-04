import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Log extends BaseService {
  constructor(http: HttpClient) {
    super(http, `https://mwanga-backend.onrender.com/app/v1/log/`);
  }
}
