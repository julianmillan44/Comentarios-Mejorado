import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppState {
  isLoading: boolean;
  currentPage: string;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  autoHide?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private readonly initialState: AppState = {
    isLoading: false,
    currentPage: 'home',
    theme: 'light',
    sidebarOpen: false,
    notifications: []
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {
    // Cargar estado del localStorage si existe
    this.loadStateFromStorage();
  }

  // Obtener el estado actual
  getCurrentState(): AppState {
    return this.stateSubject.value;
  }

  // Actualizar el estado completo
  updateState(newState: Partial<AppState>): void {
    const currentState = this.getCurrentState();
    const updatedState = { ...currentState, ...newState };
    this.stateSubject.next(updatedState);
    this.saveStateToStorage(updatedState);
  }

  // Loading state
  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  getLoading(): Observable<boolean> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.isLoading));
    });
  }

  // Current page
  setCurrentPage(page: string): void {
    this.updateState({ currentPage: page });
  }

  getCurrentPage(): Observable<string> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.currentPage));
    });
  }

  // Theme management
  setTheme(theme: 'light' | 'dark'): void {
    this.updateState({ theme });
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentState().theme;
    this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }

  getTheme(): Observable<'light' | 'dark'> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.theme));
    });
  }

  // Sidebar management
  setSidebarOpen(isOpen: boolean): void {
    this.updateState({ sidebarOpen: isOpen });
  }

  toggleSidebar(): void {
    const currentState = this.getCurrentState();
    this.setSidebarOpen(!currentState.sidebarOpen);
  }

  getSidebarState(): Observable<boolean> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.sidebarOpen));
    });
  }

  // Notifications management
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      autoHide: notification.autoHide ?? true,
      duration: notification.duration ?? 5000
    };

    const currentState = this.getCurrentState();
    const notifications = [...currentState.notifications, newNotification];
    this.updateState({ notifications });

    // Auto-hide notification
    if (newNotification.autoHide) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, newNotification.duration);
    }
  }

  removeNotification(id: string): void {
    const currentState = this.getCurrentState();
    const notifications = currentState.notifications.filter(n => n.id !== id);
    this.updateState({ notifications });
  }

  clearAllNotifications(): void {
    this.updateState({ notifications: [] });
  }

  getNotifications(): Observable<Notification[]> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.notifications));
    });
  }

  // Convenience methods for different notification types
  showSuccess(message: string, autoHide: boolean = true): void {
    this.addNotification({ type: 'success', message, autoHide });
  }

  showError(message: string, autoHide: boolean = false): void {
    this.addNotification({ type: 'error', message, autoHide });
  }

  showWarning(message: string, autoHide: boolean = true): void {
    this.addNotification({ type: 'warning', message, autoHide });
  }

  showInfo(message: string, autoHide: boolean = true): void {
    this.addNotification({ type: 'info', message, autoHide });
  }

  // Reset state
  resetState(): void {
    this.stateSubject.next(this.initialState);
    this.clearStorage();
  }

  // Private methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveStateToStorage(state: AppState): void {
    try {
      // Solo guardamos ciertos campos en localStorage
      const stateToSave = {
        theme: state.theme,
        sidebarOpen: state.sidebarOpen
      };
      const stateString = JSON.stringify(stateToSave);
      // Comentado porque no podemos usar localStorage en artifacts
      // localStorage.setItem('appState', stateString);
    } catch (error) {
      console.warn('Could not save state to localStorage:', error);
    }
  }

  private loadStateFromStorage(): void {
    try {
      // Comentado porque no podemos usar localStorage en artifacts
      // const stateString = localStorage.getItem('appState');
      // if (stateString) {
      //   const savedState = JSON.parse(stateString);
      //   this.updateState(savedState);
      //
      //   // Aplicar tema al cargar
      //   if (savedState.theme) {
      //     document.body.classList.toggle('dark-theme', savedState.theme === 'dark');
      //   }
      // }
    } catch (error) {
      console.warn('Could not load state from localStorage:', error);
    }
  }

  private clearStorage(): void {
    try {
      // localStorage.removeItem('appState');
    } catch (error) {
      console.warn('Could not clear localStorage:', error);
    }
  }
}
