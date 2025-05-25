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
    this.baseUrl = environment.production ? '/api' : 'http://localhost:3000';
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

    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        map(response => this.handleResponse(response)),
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

    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, options)
      .pipe(
        map(response => this.handleResponse(response)),
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

    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, options)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
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

    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}${endpoint}`, options)
      .pipe(catchError(this.handleError));
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

    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, formData, { headers })
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
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
      'Content-Type': 'application/json'
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
   * Handle successful API response
   */
  private handleResponse<T>(response: ApiResponse<T>): T {
    if (response.success) {
      return response.data as T;
    } else {
      throw new Error(response.message || 'Error en la respuesta del servidor');
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión a internet.';
      } else if (error.status >= 400 && error.status < 500) {
        errorMessage = error.error?.message || `Error del cliente (${error.status})`;
      } else if (error.status >= 500) {
        errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
      }
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}
