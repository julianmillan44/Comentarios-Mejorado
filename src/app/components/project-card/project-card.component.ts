import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectCardData } from '../../models/project';

@Component({
  selector: 'app-project-card',
  standalone: false,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: ProjectCardData;
  @Input() showStats: boolean = true;
  @Output() projectClick = new EventEmitter<ProjectCardData>();
  @Output() viewDetails = new EventEmitter<ProjectCardData>();

  onCardClick(): void {
    this.projectClick.emit(this.project);
  }

  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.viewDetails.emit(this.project);
  }

  onLinkClick(event: Event): void {
    event.stopPropagation();
  }

  getStatusClass(): string {
    switch (this.project.status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-progress';
      case 'planned':
        return 'status-planned';
      default:
        return '';
    }
  }

  getStatusLabel(): string {
    switch (this.project.status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En Desarrollo';
      case 'planned':
        return 'Planificado';
      default:
        return '';
    }
  }

  formatDate(date?: Date): string {
    if (!date) {
      return this.project.createdAt.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long'
      });
    }

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  }

  // Getters para compatibilidad con el template existente
  get tags(): string[] {
    return this.project.tags || this.project.technologies || [];
  }

  get image(): string {
    return this.project.image || this.project.imageUrl || '/assets/images/project-placeholder.jpg';
  }

  get demo(): string | undefined {
    return this.project.demo || this.project.demoUrl;
  }

  get github(): string | undefined {
    return this.project.github || this.project.githubUrl;
  }
}
