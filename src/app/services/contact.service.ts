// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateContactDto, ContactMessage } from '../models/contact';
import { ApiResponse, PaginatedResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  // Crear un nuevo mensaje de contacto
  createContact(contactData: CreateContactDto): Observable<ApiResponse<ContactMessage>> {
    console.log('Sending contact data:', contactData);
    return this.http.post<ApiResponse<ContactMessage>>(this.apiUrl, contactData);
  }

  // Obtener todos los mensajes (para admin)
  getAllContacts(page: number = 1, limit: number = 10): Observable<PaginatedResponse<ContactMessage>> {
    return this.http.get<PaginatedResponse<ContactMessage>>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  // Obtener mensajes no leídos
  getUnreadContacts(): Observable<ApiResponse<ContactMessage[]>> {
    return this.http.get<ApiResponse<ContactMessage[]>>(`${this.apiUrl}/unread`);
  }

  // Obtener conteo de mensajes no leídos
  getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.http.get<ApiResponse<{ count: number }>>(`${this.apiUrl}/unread/count`);
  }

  // Marcar mensaje como leído
  markAsRead(id: string): Observable<ApiResponse<ContactMessage>> {
    return this.http.patch<ApiResponse<ContactMessage>>(`${this.apiUrl}/${id}/read`, {});
  }

  // Buscar mensajes
  searchContacts(term: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<ContactMessage>> {
    return this.http.get<PaginatedResponse<ContactMessage>>(`${this.apiUrl}/search?q=${term}&page=${page}&limit=${limit}`);
  }

  // Obtener por rango de fechas
  getContactsByDateRange(startDate: string, endDate: string): Observable<ApiResponse<ContactMessage[]>> {
    return this.http.get<ApiResponse<ContactMessage[]>>(`${this.apiUrl}/date-range?start=${startDate}&end=${endDate}`);
  }

  // Eliminar mensaje
  deleteContact(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
