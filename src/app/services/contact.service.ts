// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CreateContactDto, ContactMessage } from '../models/contact';
import { ApiResponse, PaginatedResponse } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly endpoint = 'contact';

  constructor(private apiService: ApiService) {}

  // Enviar mensaje de contacto
  createContact(contactData: CreateContactDto): Observable<ApiResponse<ContactMessage>> {
    console.log('ContactService: Sending contact data:', contactData);
    return this.apiService.post<ApiResponse<ContactMessage>>(this.endpoint, contactData);
  }

  // Obtener todos los mensajes de contacto (para admin)
  getContactMessages(page: number = 1, limit: number = 10): Observable<PaginatedResponse<ContactMessage>> {
    return this.apiService.getPaginated<ContactMessage>(this.endpoint, page, limit);
  }

  // Obtener mensajes no leídos (para admin)
  getUnreadMessages(): Observable<ApiResponse<ContactMessage[]>> {
    return this.apiService.get<ApiResponse<ContactMessage[]>>(`${this.endpoint}/unread`);
  }

  // Obtener un mensaje específico (para admin)
  getContactMessage(id: string): Observable<ApiResponse<ContactMessage>> {
    return this.apiService.get<ApiResponse<ContactMessage>>(`${this.endpoint}/${id}`);
  }

  // Marcar mensaje como leído (para admin)
  markAsRead(id: string): Observable<ApiResponse<ContactMessage>> {
    return this.apiService.patch<ApiResponse<ContactMessage>>(`${this.endpoint}/${id}/read`, {});
  }

  // Marcar mensaje como no leído (para admin)
  markAsUnread(id: string): Observable<ApiResponse<ContactMessage>> {
    return this.apiService.patch<ApiResponse<ContactMessage>>(`${this.endpoint}/${id}/unread`, {});
  }

  // Eliminar mensaje (para admin)
  deleteContactMessage(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Obtener conteo de mensajes no leídos (para admin)
  getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.apiService.get<ApiResponse<{ count: number }>>(`${this.endpoint}/unread/count`);
  }

  // Buscar mensajes (para admin)
  searchMessages(term: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<ContactMessage>> {
    return this.apiService.getPaginated<ContactMessage>(`${this.endpoint}/search`, page, limit, { q: term });
  }
}
