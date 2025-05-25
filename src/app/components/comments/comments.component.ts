import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface Comment {
  id: number;
  author: string;
  email: string;
  content: string;
  date: Date;
  avatar?: string;
  likes: number;
  replies?: Comment[];
  isReply?: boolean;
  parentId?: number;
}

export interface NewComment {
  author: string;
  email: string;
  content: string;
  parentId?: number;
}

@Component({
  selector: 'app-comments',
  standalone: false,
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
  @Input() postId: number = 0;
  @Input() allowReplies: boolean = true;
  @Output() commentAdded = new EventEmitter<Comment>();

  comments: Comment[] = [];
  newComment: NewComment = {
    author: '',
    email: '',
    content: ''
  };

  isSubmitting = false;
  showCommentForm = false;
  replyingTo: number | null = null;

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    // Datos de ejemplo - en un proyecto real esto vendría de un servicio
    this.comments = [
      {
        id: 1,
        author: 'María García',
        email: 'maria@email.com',
        content: '¡Excelente artículo! Me ha ayudado mucho a entender mejor el tema. ¿Podrías profundizar más en la parte de implementación?',
        date: new Date('2024-01-15T10:30:00'),
        avatar: '/assets/images/avatar-1.jpg',
        likes: 12,
        replies: [
          {
            id: 5,
            author: 'Carlos López',
            email: 'carlos@email.com',
            content: 'Estoy de acuerdo con María. Sería genial ver ejemplos más detallados.',
            date: new Date('2024-01-15T14:20:00'),
            avatar: '/assets/images/avatar-2.jpg',
            likes: 3,
            isReply: true,
            parentId: 1
          }
        ]
      },
      {
        id: 2,
        author: 'Ana Rodríguez',
        email: 'ana@email.com',
        content: 'Muy útil la información. He estado buscando algo así durante semanas. ¡Gracias por compartir!',
        date: new Date('2024-01-16T09:15:00'),
        avatar: '/assets/images/avatar-3.jpg',
        likes: 8
      },
      {
        id: 3,
        author: 'David Martín',
        email: 'david@email.com',
        content: 'Interesante enfoque. Aunque creo que hay algunas alternativas que también valdría la pena considerar.',
        date: new Date('2024-01-17T16:45:00'),
        avatar: '/assets/images/avatar-4.jpg',
        likes: 5
      }
    ];
  }

  toggleCommentForm(): void {
    this.showCommentForm = !this.showCommentForm;
    if (!this.showCommentForm) {
      this.resetForm();
    }
  }

  onSubmitComment(): void {
    if (!this.validateComment()) {
      return;
    }

    this.isSubmitting = true;

    // Simulación de envío
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now(),
        author: this.newComment.author,
        email: this.newComment.email,
        content: this.newComment.content,
        date: new Date(),
        likes: 0,
        parentId: this.newComment.parentId
      };

      if (this.newComment.parentId) {
        // Es una respuesta
        const parentComment = this.findCommentById(this.newComment.parentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          comment.isReply = true;
          parentComment.replies.push(comment);
        }
      } else {
        // Es un comentario principal
        this.comments.unshift(comment);
      }

      this.commentAdded.emit(comment);
      this.resetForm();
      this.isSubmitting = false;
      this.showCommentForm = false;
      this.replyingTo = null;
    }, 1000);
  }

  onReply(commentId: number): void {
    this.replyingTo = commentId;
    this.newComment.parentId = commentId;
    this.showCommentForm = true;
  }

  onLikeComment(commentId: number): void {
    const comment = this.findCommentById(commentId);
    if (comment) {
      comment.likes++;
    }
  }

  findCommentById(id: number): Comment | null {
    for (const comment of this.comments) {
      if (comment.id === id) {
        return comment;
      }
      if (comment.replies) {
        for (const reply of comment.replies) {
          if (reply.id === id) {
            return reply;
          }
        }
      }
    }
    return null;
  }

  validateComment(): boolean {
    const { author, email, content } = this.newComment;

    if (!author.trim()) {
      alert('Por favor, ingresa tu nombre.');
      return false;
    }

    if (!email.trim() || !this.isValidEmail(email)) {
      alert('Por favor, ingresa un email válido.');
      return false;
    }

    if (!content.trim()) {
      alert('Por favor, escribe tu comentario.');
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  resetForm(): void {
    this.newComment = {
      author: '',
      email: '',
      content: '',
      parentId: undefined
    };
  }

  cancelReply(): void {
    this.replyingTo = null;
    this.newComment.parentId = undefined;
    this.showCommentForm = false;
    this.resetForm();
  }

  getCommentsCount(): number {
    let count = this.comments.length;
    this.comments.forEach(comment => {
      if (comment.replies) {
        count += comment.replies.length;
      }
    });
    return count;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
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
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}
