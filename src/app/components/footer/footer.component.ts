import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/julianmillan44',
      icon: 'github',
      color: '#333'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/tu-perfil',
      icon: 'linkedin',
      color: '#0077b5'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/tu-usuario',
      icon: 'twitter',
      color: '#1da1f2'
    },
    {
      name: 'Email',
      url: 'mailto:tu-email@ejemplo.com',
      icon: 'mail',
      color: '#ea4335'
    }
  ];

  quickLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Acerca de', path: '/about' },
    { label: 'Proyectos', path: '/projects' },
    { label: 'Contacto', path: '/contact' }
  ];

  skills = [
    'Angular', 'NestJS', 'TypeScript', 'Node.js',
    'MySQL', 'Docker', 'Git', 'CSS'
  ];

  constructor() { }

  ngOnInit(): void {
  }

  openSocialLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
