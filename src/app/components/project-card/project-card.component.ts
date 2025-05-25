import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  github?: string;
  demo?: string;
  status?: 'completed' | 'in-progress' | 'planned';
  date?: Date;
  duration?: string;
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
  @Input() showStats: boolean = false;
  @Output() projectClick = new EventEmitter<Project>();
  @Output() viewDetails = new EventEmitter<Project>();

  onCardClick(): void {
    this.projectClick.emit(this.project);
  }

  viewProject(event: Event): void {
    event.stopPropagation();
    this.viewDetails.emit(this.project);
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'completed': 'Completado',
      'in-progress': 'En desarrollo',
      'planned': 'Planificado'
    };
    return statusMap[status] || status;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short'
    }).format(new Date(date));
  }

  getDefaultImage(): string {
    return '/assets/images/default-project.jpg';
  }
}
