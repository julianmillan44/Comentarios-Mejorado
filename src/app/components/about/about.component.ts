import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  personalCode = [
    'const aboutMe = {',
    '  name: "Julián Millán",',
    '  role: "Full Stack Developer",',
    '  experience: "3+ years",',
    '  passion: "Creating amazing UX"',
    '};'
  ];

  experiences = [
    {
      period: '2022 - Presente',
      title: 'Desarrollador Full Stack Senior',
      company: 'Tech Solutions Inc.',
      description: 'Liderazgo de equipo en el desarrollo de aplicaciones web escalables usando Angular y NestJS. Implementación de arquitecturas robustas y mejores prácticas de desarrollo.',
      skills: ['Angular', 'NestJS', 'TypeScript', 'Docker', 'PostgreSQL']
    },
    {
      period: '2021 - 2022',
      title: 'Desarrollador Frontend',
      company: 'Digital Agency Pro',
      description: 'Desarrollo de interfaces de usuario responsivas y optimizadas. Colaboración estrecha con equipos de diseño UX/UI para crear experiencias excepcionales.',
      skills: ['Angular', 'JavaScript', 'CSS3', 'HTML5', 'Bootstrap']
    },
    {
      period: '2020 - 2021',
      title: 'Desarrollador Junior',
      company: 'StartUp Innovate',
      description: 'Primeros pasos en el desarrollo profesional. Participación en proyectos diversos y aprendizaje continuo de nuevas tecnologías.',
      skills: ['JavaScript', 'Node.js', 'MySQL', 'Git', 'Express']
    }
  ];

  techCategories = [
    {
      name: 'Frontend',
      technologies: [
        { name: 'Angular', icon: '🅰️', level: 90 },
        { name: 'TypeScript', icon: '📘', level: 85 },
        { name: 'JavaScript', icon: '💛', level: 90 },
        { name: 'HTML5', icon: '🌐', level: 95 },
        { name: 'CSS3', icon: '🎨', level: 85 },
        { name: 'RxJS', icon: '🔄', level: 80 }
      ]
    },
    {
      name: 'Backend',
      technologies: [
        { name: 'NestJS', icon: '🐈', level: 85 },
        { name: 'Node.js', icon: '🟢', level: 80 },
        { name: 'Express', icon: '🚂', level: 75 },
        { name: 'REST APIs', icon: '🔌', level: 90 },
        { name: 'TypeORM', icon: '🗄️', level: 70 },
        { name: 'Socket.io', icon: '🔌', level: 65 }
      ]
    },
    {
      name: 'Bases de Datos',
      technologies: [
        { name: 'MySQL', icon: '🐬', level: 85 },
        { name: 'PostgreSQL', icon: '🐘', level: 80 },
        { name: 'MongoDB', icon: '🍃', level: 70 },
        { name: 'Redis', icon: '🔴', level: 65 }
      ]
    },
    {
      name: 'DevOps & Tools',
      technologies: [
        { name: 'Docker', icon: '🐳', level: 75 },
        { name: 'Git', icon: '📚', level: 90 },
        { name: 'GitHub', icon: '🐙', level: 85 },
        { name: 'VS Code', icon: '💻', level: 95 },
        { name: 'Postman', icon: '📮', level: 80 },
        { name: 'Linux', icon: '🐧', level: 70 }
      ]
    }
  ];

  personalInterests = [
    {
      icon: '📚',
      title: 'Aprendizaje Continuo',
      description: 'Siempre explorando nuevas tecnologías, frameworks y metodologías de desarrollo. La curiosidad es mi motor principal.'
    },
    {
      icon: '🎮',
      title: 'Gaming & Tech',
      description: 'Apasionado por los videojuegos y la tecnología emergente. Siempre al tanto de las últimas innovaciones del sector.'
    },
    {
      icon: '🎸',
      title: 'Música',
      description: 'La música es mi escape creativo. Toco la guitarra en mis tiempos libres y disfruto explorando diferentes géneros.'
    },
    {
      icon: '✈️',
      title: 'Viajes',
      description: 'Explorar nuevas culturas y lugares me inspira y me da nuevas perspectivas para mi trabajo y vida personal.'
    },
    {
      icon: '🏃‍♂️',
      title: 'Deportes',
      description: 'Mantengo un estilo de vida activo. Correr y hacer ejercicio me ayuda a mantener la mente clara y enfocada.'
    },
    {
      icon: '👥',
      title: 'Comunidad Tech',
      description: 'Participación activa en comunidades de desarrolladores, meetups y eventos tecnológicos locales.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.animateElements();
  }

  private animateElements(): void {
    // Añadir animaciones escalonadas a los elementos
    setTimeout(() => {
      const timelineItems = document.querySelectorAll('.timeline-item');
      const techCategories = document.querySelectorAll('.tech-category');
      const interestCards = document.querySelectorAll('.interest-card');

      this.staggerAnimation(timelineItems, 200);
      this.staggerAnimation(techCategories, 150);
      this.staggerAnimation(interestCards, 100);
    }, 500);
  }

  private staggerAnimation(elements: NodeListOf<Element>, delay: number): void {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-in');
      }, index * delay);
    });
  }
}
