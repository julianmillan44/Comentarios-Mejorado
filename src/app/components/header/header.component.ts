import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentRoute: string = '';
  isMenuOpen: boolean = false;

  navigationItems = [
    { path: '/', label: 'Inicio', icon: 'house-fill' },
    { path: '/about', label: 'Acerca de', icon: 'person-fill' },
    { path: '/projects', label: 'Proyectos', icon: 'code-square' },
    { path: '/comments', label: 'Comentarios', icon: 'chat-square-dots-fill' },
    { path: '/contact', label: 'Contacto', icon: 'envelope-fill' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });

    // Establecer ruta inicial
    this.currentRoute = this.router.url;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  isActiveRoute(path: string): boolean {
    if (path === '/') {
      return this.currentRoute === path;
    }
    return this.currentRoute.startsWith(path);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
  }
}
