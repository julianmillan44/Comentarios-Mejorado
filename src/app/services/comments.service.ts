import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Comment, CreateCommentDto } from '../models/comment';
import { ApiResponse, PaginatedResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly endpoint = 'comments';

  constructor(private apiService: ApiService) {}

  // Obtener todos los comentarios aprobados con paginación
  getComments(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Comment>> {
    return this.apiService.getPaginated<Comment>(this.endpoint, page, limit);
  }

  // Obtener todos los comentarios (para admin) con paginación
  getAllComments(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Comment>> {
    return this.apiService.getPaginated<Comment>(`${this.endpoint}/admin`, page, limit);
  }

  // Obtener comentarios pendientes de aprobación (para admin)
  getPendingComments(): Observable<ApiResponse<Comment[]>> {
    return this.apiService.get<ApiResponse<Comment[]>>(`${this.endpoint}/pending`);
  }

  // Obtener un comentario por ID
  getComment(id: string): Observable<ApiResponse<Comment>> {
    return this.apiService.get<ApiResponse<Comment>>(`${this.endpoint}/${id}`);
  }

  // Crear nuevo comentario
  createComment(comment: CreateCommentDto): Observable<ApiResponse<Comment>> {
    console.log('Creating comment:', comment);
    return this.apiService.post<ApiResponse<Comment>>(this.endpoint, comment);
  }

  // Aprobar comentario (para admin)
  approveComment(id: string): Observable<ApiResponse<Comment>> {
    return this.apiService.patch<ApiResponse<Comment>>(`${this.endpoint}/${id}/approve`, {});
  }

  // Rechazar comentario (para admin)
  rejectComment(id: string): Observable<ApiResponse<Comment>> {
    return this.apiService.patch<ApiResponse<Comment>>(`${this.endpoint}/${id}/reject`, {});
  }

  // Eliminar comentario (para admin)
  deleteComment(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Obtener comentarios recientes (últimos N comentarios aprobados)
  getRecentComments(limit: number = 5): Observable<ApiResponse<Comment[]>> {
    return this.apiService.get<ApiResponse<Comment[]>>(`${this.endpoint}/recent`, { limit });
  }

  // Contar comentarios pendientes (para admin)
  getPendingCount(): Observable<ApiResponse<{ count: number }>> {
    return this.apiService.get<ApiResponse<{ count: number }>>(`${this.endpoint}/pending/count`);
  }
}
