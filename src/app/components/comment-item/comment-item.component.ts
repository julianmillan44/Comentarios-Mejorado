import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-comment-item',
  standalone: false,
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.css'
})
export class CommentItemComponent {
  @Input() comment!: Comment;
  @Input() allowReplies: boolean = true;
  @Input() isReply: boolean = false;
  @Output() replyClick = new EventEmitter<string>();
  @Output() likeClick = new EventEmitter<string>();

  onReply(): void {
    if (this.allowReplies && this.comment?.id) {
      this.replyClick.emit(this.comment.id);
    }
  }

  onLike(): void {
    if (this.comment?.id) {
      this.likeClick.emit(this.comment.id);
    }
  }

  formatDate(date: Date | undefined): string {
    // Si no hay fecha, usar fecha actual
    const targetDate = date || new Date();

    const now = new Date();
    const diff = now.getTime() - targetDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `hace ${minutes} minutos`;
      }
      return `hace ${hours} horas`;
    } else if (days === 1) {
      return 'hace 1 día';
    } else if (days < 7) {
      return `hace ${days} días`;
    } else {
      return targetDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  getAvatarUrl(): string {
    // Verificar que comment existe antes de acceder a sus propiedades
    if (!this.comment) {
      return this.getDefaultAvatar();
    }

    // Generate a consistent avatar based on email or use default
    if (this.comment.avatar) {
      return this.comment.avatar;
    }

    // Generate avatar based on first letter of name or author
    const displayName = this.comment.author || this.comment.name;
    const firstLetter = displayName?.charAt(0).toUpperCase() || '?';
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const colorIndex = (displayName?.length || 0) % colors.length;

    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${colors[colorIndex]}"/>
        <text x="20" y="28" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">${firstLetter}</text>
      </svg>
    `)}`;
  }

  private getDefaultAvatar(): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${colors[0]}"/>
        <text x="20" y="28" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">?</text>
      </svg>
    `)}`;
  }
}
