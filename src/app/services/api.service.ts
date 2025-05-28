import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Configuración corregida para Docker y desarrollo
    if (environment.production) {
      this.baseUrl = '/api';
    } else {
      this.baseUrl = 'http://localhost:3001/api';
    }
    console.log('API Base URL:', this.baseUrl);
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    const httpParams = this.buildParams(params);
    const options = {
      headers: this.getHeaders(),
      params: httpParams
    };

    const url = `${this.baseUrl}/${endpoint}`;
    console.log('GET Request to:', url, 'with params:', params);

    return this.http.get<T>(url, options)
      .pipe(
        map((response: any) => {
          console.log('GET Response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };

    const url = `${this.baseUrl}/${endpoint}`;
    console.log('POST Request to:', url, 'with data:', data);

    return this.http.post<T>(url, data, options)
      .pipe(
        map((response: any) => {
          console.log('POST Response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * GET paginated data
   */
  getPaginated<T>(endpoint: string, page: number = 1, limit: number = 10, params?: any): Observable<PaginatedResponse<T>> {
    const paginationParams = { page: page.toString(), limit: limit.toString(), ...params };
    const httpParams = this.buildParams(paginationParams);
    const options = {
      headers: this.getHeaders(),
      params: httpParams
    };

    const url = `${this.baseUrl}/${endpoint}`;
    console.log('GET Paginated Request to:', url, 'with params:', paginationParams);

    return this.http.get<PaginatedResponse<T>>(url, options)
      .pipe(
        map((response: any) => {
          console.log('GET Paginated Response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Upload file
   */
  uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    // No establecer Content-Type header para FormData
    const headers = new HttpHeaders({
      'Authorization': this.getAuthToken() || ''
    });

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Build HTTP params
   */
  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return httpParams;
  }

  /**
   * Get HTTP headers
   */
  private getHeaders(): HttpHeaders {
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string | null {
    // Por ahora retornamos null, más adelante implementaremos JWT
    return null;
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    console.error('Full HTTP Error:', error);

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.';
      } else if (error.status >= 400 && error.status < 500) {
        errorMessage = error.error?.message || `Error del cliente (${error.status})`;
      } else if (error.status >= 500) {
        errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
      }
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };
}
