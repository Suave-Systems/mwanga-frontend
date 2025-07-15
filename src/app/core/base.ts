import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export class BaseService {
  constructor(protected httpClient: HttpClient, private baseUrl: string) {}

  sendGetAll<T>(
    params: Record<string, string> = {},
    url: string = this.baseUrl
  ): Observable<T> {
    // Only add query string if params exist
    const keys = Object.keys(params);
    if (keys.length > 0) {
      const queryString = keys
        .filter(
          (key) =>
            params[key] !== undefined &&
            params[key] !== null &&
            params[key] !== ''
        )
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join('&');

      url += url.includes('?') ? '&' + queryString : '?' + queryString;
    }
    return this.httpClient.get(url).pipe(map((body: any) => body));
  }

  sendGetById<T>(id: string, url: string = this.baseUrl): Observable<T> {
    // Only add query string if params exist

    return this.httpClient.get(`${url}${id}/`).pipe(map((body: any) => body));
  }

  sendPost<T>(payload: any, url: string = this.baseUrl): Observable<T> {
    return this.httpClient.post(url, payload).pipe(map((body: any) => body));
  }

  sendDelete<T>(url: string = this.baseUrl): Observable<T> {
    return this.httpClient.delete(url).pipe(map((body: any) => body));
  }

  sendPut<T>(payload: any = null, url: string = this.baseUrl): Observable<T> {
    return this.httpClient.put(url, payload).pipe(map((body: any) => body));
  }

  sendPatch<T>(payload: any, url: string = this.baseUrl): Observable<T> {
    return this.httpClient
      .patch(`${url}${payload.id}/`, payload)
      .pipe(map((body: any) => body));
  }
}
