import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  codeLines = [
    'const developer = {',
    '  name: "Julian",',
    '  skills: ["Angular", "NestJS"],',
    '  passion: "Code"',
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
  ]

  skillCategories = [
    {
      name: 'Frontend',
      skills: ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'JavaScript', 'RxJS']
    },
    {
      name: 'Backend',
      skills: ['NestJS', 'Node.js', 'Express', 'REST APIs', 'TypeORM']
    },
    {
      name: 'Base de Datos',
      skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis']
    },
    {
      name: 'DevOps & Herramientas',
      skills: ['Docker', 'Git', 'GitHub', 'VS Code', 'Postman']
    }
  ];

  featuredProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Plataforma completa de comercio electrónico con panel administrativo y sistema de pagos.',
      tags: ['Angular', 'NestJS', 'MySQL', 'Docker'],
      github: 'https://github.com/julianmillan44',
      image: '/assets/images/project1.jpg'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Aplicación de gestión de tareas con colaboración en tiempo real y notificaciones.',
      tags: ['Angular', 'Socket.io', 'MongoDB'],
      github: 'https://github.com/julianmillan44',
      image: '/assets/images/project2.jpg'
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'Sitio web personal responsivo con panel de administración para gestionar contenido.',
      tags: ['Angular', 'CSS3', 'TypeScript'],
      github: 'https://github.com/julianmillan44',
      image: '/assets/images/project3.jpg'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Animación de entrada
    this.animateOnLoad();
  }

  viewProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  private animateOnLoad(): void {
    // Añadir clases de animación después de un pequeño delay
    setTimeout(() => {
      const elements = document.querySelectorAll('.stat-card, .skill-category, .project-preview');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-in');
        }, index * 100);
      });
    }, 500);
  }
}
