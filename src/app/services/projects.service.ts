import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Project, CreateProjectDto } from '../models/project';
import { ApiResponse, PaginatedResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly endpoint = 'projects';

  constructor(private apiService: ApiService) {}

  // Obtener todos los proyectos con paginación
  getProjects(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Project>> {
    return this.apiService.get<PaginatedResponse<Project>>(`${this.endpoint}?page=${page}&limit=${limit}`);
  }

  // Obtener proyectos destacados
  getFeaturedProjects(): Observable<ApiResponse<Project[]>> {
    return this.apiService.get<ApiResponse<Project[]>>(`${this.endpoint}/featured`);
  }

  // Obtener un proyecto por ID
  getProject(id: number): Observable<ApiResponse<Project>> {
    return this.apiService.get<ApiResponse<Project>>(`${this.endpoint}/${id}`);
  }

  // Crear nuevo proyecto (para admin)
  createProject(project: CreateProjectDto): Observable<ApiResponse<Project>> {
    return this.apiService.post<ApiResponse<Project>>(this.endpoint, project);
  }

  // Actualizar proyecto (para admin)
  updateProject(id: number, project: Partial<CreateProjectDto>): Observable<ApiResponse<Project>> {
    return this.apiService.put<ApiResponse<Project>>(`${this.endpoint}/${id}`, project);
  }

  // Eliminar proyecto (para admin)
  deleteProject(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Buscar proyectos por tecnología
  getProjectsByTechnology(technology: string): Observable<ApiResponse<Project[]>> {
    return this.apiService.get<ApiResponse<Project[]>>(`${this.endpoint}/technology/${technology}`);
  }

  // Obtener todas las tecnologías únicas
  getTechnologies(): Observable<ApiResponse<string[]>> {
    return this.apiService.get<ApiResponse<string[]>>(`${this.endpoint}/technologies`);
  }
}
