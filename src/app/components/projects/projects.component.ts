import { Component, OnInit } from '@angular/core';
import { ProjectCardData } from '../../models/project';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: ProjectCardData[] = [];
  filteredProjects: ProjectCardData[] = [];
  selectedCategory: string = 'all';
  searchTerm: string = '';

  categories = [
    { value: 'all', label: 'Todos' },
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Móvil' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'api', label: 'API' }
  ];

  ngOnInit(): void {
    this.loadProjects();
    this.filteredProjects = this.projects;
  }

  loadProjects(): void {
    // Datos de ejemplo - en un proyecto real esto vendría de un servicio
    this.projects = [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'Plataforma completa de comercio electrónico con carrito de compras, sistema de pagos y panel de administración.',
        shortDescription: 'Plataforma completa de comercio electrónico',
        technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe'],
        imageUrl: '/assets/images/ecommerce-project.jpg',
        githubUrl: 'https://github.com/tu-usuario/ecommerce-platform',
        demoUrl: 'https://demo-ecommerce.com',
        featured: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        // Extended properties
        image: '/assets/images/ecommerce-project.jpg',
        tags: ['Angular', 'Node.js', 'MongoDB', 'Stripe'],
        github: 'https://github.com/tu-usuario/ecommerce-platform',
        demo: 'https://demo-ecommerce.com',
        status: 'completed',
        date: new Date('2024-01-15'),
        duration: '3 meses',
        stars: 45,
        forks: 12
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'Aplicación de gestión de tareas con funcionalidades de colaboración en tiempo real y notificaciones.',
        shortDescription: 'App de gestión de tareas colaborativas',
        technologies: ['React', 'Firebase', 'Material-UI'],
        imageUrl: '/assets/images/task-app.jpg',
        githubUrl: 'https://github.com/tu-usuario/task-manager',
        demoUrl: 'https://task-manager-demo.com',
        featured: false,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10'),
        // Extended properties
        image: '/assets/images/task-app.jpg',
        tags: ['React', 'Firebase', 'Material-UI'],
        github: 'https://github.com/tu-usuario/task-manager',
        demo: 'https://task-manager-demo.com',
        status: 'in-progress',
        date: new Date('2024-03-10'),
        duration: '2 meses',
        stars: 28,
        forks: 8
      },
      {
        id: 3,
        title: 'Weather Dashboard',
        description: 'Dashboard meteorológico con mapas interactivos, pronósticos extendidos y alertas personalizadas.',
        shortDescription: 'Dashboard meteorológico interactivo',
        technologies: ['Vue.js', 'Chart.js', 'OpenWeather API'],
        githubUrl: 'https://github.com/tu-usuario/weather-dashboard',
        featured: true,
        createdAt: new Date('2023-11-20'),
        updatedAt: new Date('2023-11-20'),
        // Extended properties
        tags: ['Vue.js', 'Chart.js', 'OpenWeather API'],
        github: 'https://github.com/tu-usuario/weather-dashboard',
        status: 'completed',
        date: new Date('2023-11-20'),
        duration: '1 mes',
        stars: 67,
        forks: 23
      },
      {
        id: 4,
        title: 'Social Media Analytics',
        description: 'Herramienta de análisis de redes sociales con métricas avanzadas y reportes automatizados.',
        shortDescription: 'Herramienta de análisis de redes sociales',
        technologies: ['Python', 'Django', 'PostgreSQL', 'D3.js'],
        featured: false,
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2024-06-01'),
        // Extended properties
        tags: ['Python', 'Django', 'PostgreSQL', 'D3.js'],
        status: 'planned',
        date: new Date('2024-06-01'),
        duration: '4 meses'
      }
    ];
  }

  onProjectClick(project: ProjectCardData): void {
    console.log('Proyecto seleccionado:', project);
    // Aquí podrías navegar a una página de detalles del proyecto
  }

  onViewDetails(project: ProjectCardData): void {
    console.log('Ver detalles del proyecto:', project);
    // Aquí podrías abrir un modal o navegar a detalles
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.applyFilters();
  }

  public applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesCategory = this.selectedCategory === 'all' ||
        project.tags?.some((tag: string) => tag.toLowerCase().includes(this.selectedCategory));

      const matchesSearch = this.searchTerm === '' ||
        project.title.toLowerCase().includes(this.searchTerm) ||
        project.description.toLowerCase().includes(this.searchTerm) ||
        project.tags?.some((tag: string) => tag.toLowerCase().includes(this.searchTerm));

      return matchesCategory && matchesSearch;
    });
  }

  getProjectsByStatus(status: string): ProjectCardData[] {
    return this.projects.filter(project => project.status === status);
  }

  trackByProjectId(index: number, project: ProjectCardData): number {
    return project.id;
  }
}
