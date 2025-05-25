import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  github?: string;
  demo?: string;
  status: 'completed' | 'in-progress' | 'planned';
  date: Date;
  duration: string;
  stars?: number;
  forks?: number;
}

@Component({
  selector: 'app-project-card',
  standalone: false,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Input() showStats: boolean = true;
  @Output() projectClick = new EventEmitter<Project>();
  @Output() viewDetails = new EventEmitter<Project>();

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

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  }
}
