import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  codeLines = [
    'const developer = {',
    '  name: "Julian",',
    '  skills: ["Angular", "NestJS"],',
    '  passion: "Innovation",',
    '  location: "Colombia"',
    '};'
  ];

  stats = [
    {
      number: '3+',
      label: 'Años de Experiencia',
      icon: 'clock'
    },
    {
      number: '15+',
      label: 'Proyectos Completados',
      icon: 'trophy'
    },
    {
      number: '50+',
      label: 'Clientes Satisfechos',
      icon: 'users'
    },
    {
      number: '1000+',
      label: 'Horas de Código',
      icon: 'coffee'
    }
  ];

  skillCategories = [
    {
      name: 'Frontend',
      skills: ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'JavaScript', 'RxJS', 'Bootstrap', 'SASS']
    },
    {
      name: 'Backend',
      skills: ['NestJS', 'Node.js', 'Express', 'REST APIs', 'GraphQL', 'TypeORM', 'JWT']
    },
    {
      name: 'Base de Datos',
      skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase']
    },
    {
      name: 'DevOps & Herramientas',
      skills: ['Docker', 'Git', 'GitHub', 'VS Code', 'Postman', 'AWS', 'Nginx']
    }
  ];

  featuredProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Plataforma completa de comercio electrónico con panel administrativo, sistema de pagos integrado y gestión de inventario en tiempo real.',
      tags: ['Angular', 'NestJS', 'MySQL', 'Docker', 'PayPal'],
      github: 'https://github.com/julianmillan44',
      demo: 'https://ecommerce-demo.com',
      image: '/assets/images/project1.jpg',
      status: 'Completado',
      year: '2024'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Aplicación de gestión de tareas con colaboración en tiempo real, notificaciones push y sistema de reportes avanzado.',
      tags: ['Angular', 'Socket.io', 'MongoDB', 'Redis'],
      github: 'https://github.com/julianmillan44',
      demo: 'https://taskapp-demo.com',
      image: '/assets/images/project2.jpg',
      status: 'Completado',
      year: '2024'
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'Sitio web personal responsivo con panel de administración CMS personalizado para gestionar contenido dinámicamente.',
      tags: ['Angular', 'CSS3', 'TypeScript', 'Firebase'],
      github: 'https://github.com/julianmillan44',
      demo: 'https://portfolio-demo.com',
      image: '/assets/images/project3.jpg',
      status: 'Completado',
      year: '2024'
    }
  ];

  private animationObserver?: IntersectionObserver;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeAnimations();
  }

  ngAfterViewInit(): void {
    this.initializeCounters();
    this.initializeTooltips();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.animationObserver) {
      this.animationObserver.disconnect();
    }
  }

  viewProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Frontend': 'fa-laptop-code',
      'Backend': 'fa-server',
      'Base de Datos': 'fa-database',
      'DevOps & Herramientas': 'fa-tools'
    };
    return iconMap[categoryName] || 'fa-code';
  }

  private initializeAnimations(): void {
    // Añadir clases de animación después de un pequeño delay
    setTimeout(() => {
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, index * 100);
      });
    }, 300);
  }

  private initializeCounters(): void {
    setTimeout(() => {
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
        this.animateCounter(counter as HTMLElement);
      });
    }, 1000);
  }

  private animateCounter(element: HTMLElement): void {
    const target = element.getAttribute('data-target');
    if (!target) return;

    const targetNumber = parseInt(target.replace(/\D/g, ''), 10);
    const suffix = target.replace(/[\d]/g, '');
    const duration = 2000;
    const increment = targetNumber / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        current = targetNumber;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  }

  private initializeTooltips(): void {
    // Inicializar tooltips de Bootstrap si están disponibles
    if (typeof (window as any).bootstrap !== 'undefined') {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');

          // Animar skill items con delay
          if (entry.target.classList.contains('skill-category')) {
            const skillItems = entry.target.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animate-in');
              }, index * 100);
            });
          }

          // Animar project cards
          if (entry.target.classList.contains('project-preview')) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, 200);
          }
        }
      });
    }, options);

    // Observar elementos que necesitan animación
    const elementsToObserve = document.querySelectorAll(
      '.stat-card, .skill-category, .project-preview, .section-header'
    );

    elementsToObserve.forEach(el => {
      this.animationObserver?.observe(el);
    });
  }

  // Método para lazy loading de imágenes
  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  // Método para manejar errores de imágenes
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/placeholder.jpg'; // Imagen por defecto
  }

  // Método para scroll suave a secciones
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Método para compartir en redes sociales
  shareOnSocial(platform: string): void {
    const url = window.location.href;
    const text = 'Conoce el portafolio de Julian Millán - Desarrollador Full Stack';

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  // Método para copiar enlace al portapapeles
  copyToClipboard(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // Mostrar notificación de éxito (puedes implementar un toast aquí)
      console.log('Enlace copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar enlace:', err);
    });
  }

  // Método para descargar CV
  downloadCV(): void {
    // Implementar descarga de CV
    const link = document.createElement('a');
    link.href = '/assets/cv/julian-millan-cv.pdf';
    link.download = 'Julian-Millan-CV.pdf';
    link.click();
  }
}
