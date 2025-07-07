import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

// import { Injectable } from '@angular/core';
// @Injectable({
//   providedIn: 'root',
// })
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
    return this.httpClient.get(url).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendGetById<T>(id: string, url: string = this.baseUrl): Observable<T> {
    // Only add query string if params exist

    return this.httpClient.get(`${url}${id}/`).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendPost<T>(payload: any, url: string = this.baseUrl): Observable<T> {
    return this.httpClient.post(url, payload).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendDelete<T>(url: string = this.baseUrl): Observable<T> {
    return this.httpClient.delete(url).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendPut<T>(payload: any = null, url: string = this.baseUrl): Observable<T> {
    return this.httpClient.put(url, payload).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendPatch<T>(payload: any, url: string = this.baseUrl): Observable<T> {
    return this.httpClient.patch(`${url}${payload.id}/`, payload).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error("An error occurred:", error.error.message);
    } else {
      if (
        error.status === 401 ||
        error.status === 504 ||
        error.status === 400
      ) {
        return throwError(
          JSON.stringify({
            name: error.error,
            status: error.status,
            message: error.message,
          })
        );
      }
    }
    return throwError(
      JSON.stringify({
        name: error.name,
        status: error.status,
        message: error.message,
      })
    );
  }
}
