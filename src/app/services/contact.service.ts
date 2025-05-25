import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ContactMessage, CreateContactDto } from '../models/contact';
import { ApiResponse, PaginatedResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly endpoint = 'contact';

  constructor(private apiService: ApiService) {}

  // Enviar mensaje de contacto
  sendMessage(contactData: CreateContactDto): Observable<ApiResponse<ContactMessage>> {
    return this.apiService.post<ApiResponse<ContactMessage>>(this.endpoint, contactData);
  }

  // Obtener todos los mensajes (para admin) con paginación
  getMessages(page: number = 1, limit: number = 10): Observable<PaginatedResponse<ContactMessage>> {
    return this.apiService.get<PaginatedResponse<ContactMessage>>(`${this.endpoint}?page=${page}&limit=${limit}`);
  }

  // Obtener mensajes no leídos (para admin)
  getUnreadMessages(): Observable<ApiResponse<ContactMessage[]>> {
    return this.apiService.get<ApiResponse<ContactMessage[]>>(`${this.endpoint}/unread`);
  }

  // Obtener un mensaje por ID (para admin)
  getMessage(id: number): Observable<ApiResponse<ContactMessage>> {
    return this.apiService.get<ApiResponse<ContactMessage>>(`${this.endpoint}/${id}`);
  }

  // Marcar mensaje como leído (para admin)
  markAsRead(id: number): Observable<ApiResponse<ContactMessage>> {
    return this.apiService.patch<ApiResponse<ContactMessage>>(`${this.endpoint}/${id}/read`, {});
  }

  // Marcar mensaje como no leído (para admin)
  markAsUnread(id: number): Observable<ApiResponse<ContactMessage>> {
    return this.apiService.patch<ApiResponse<ContactMessage>>(`${this.endpoint}/${id}/unread`, {});
  }

  // Eliminar mensaje (para admin)
  deleteMessage(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Contar mensajes no leídos (para admin)
  getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.apiService.get<ApiResponse<{ count: number }>>(`${this.endpoint}/unread/count`);
  }

  // Buscar mensajes por término (para admin)
  searchMessages(term: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<ContactMessage>> {
    return this.apiService.get<PaginatedResponse<ContactMessage>>(`${this.endpoint}/search?q=${encodeURIComponent(term)}&page=${page}&limit=${limit}`);
  }

  // Obtener mensajes por fecha (para admin)
  getMessagesByDateRange(startDate: string, endDate: string): Observable<ApiResponse<ContactMessage[]>> {
    return this.apiService.get<ApiResponse<ContactMessage[]>>(`${this.endpoint}/date-range?start=${startDate}&end=${endDate}`);
  }
}
