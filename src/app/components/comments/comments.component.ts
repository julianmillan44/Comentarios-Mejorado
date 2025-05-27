import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { AppStateService } from '../../services/app-state.service';
import { Comment, CreateCommentDto } from '../../models/comment';

@Component({
  selector: 'app-comments',
  standalone:false,
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  commentForm: FormGroup;
  comments: Comment[] = [];
  isLoading = false;
  isSubmitting = false;
  currentPage = 1;
  totalPages = 1;
  limit = 10;

  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService,
    private appStateService: AppStateService
  ) {
    this.commentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.commentsService.getComments(this.currentPage, this.limit).subscribe({
      next: (response) => {
        console.log('Comments response:', response);
        if (response.success) {
          this.comments = response.data;
          this.totalPages = response.pagination.totalPages;
        } else {
          this.appStateService.showError('Error al cargar comentarios');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.appStateService.showError(`Error al cargar comentarios: ${error.message}`);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const commentData: CreateCommentDto = this.commentForm.value;

      console.log('Submitting comment:', commentData);

      this.commentsService.createComment(commentData).subscribe({
        next: (response) => {
          console.log('Comment created response:', response);
          if (response.success) {
            this.appStateService.showSuccess('¡Comentario enviado! Será revisado antes de publicarse.');
            this.commentForm.reset();
            // No recargamos los comentarios inmediatamente porque necesita aprobación
          } else {
            this.appStateService.showError(response.message || 'Error al enviar comentario');
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating comment:', error);
          this.appStateService.showError(`Error al enviar comentario: ${error.message}`);
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.commentForm.controls).forEach(key => {
      const control = this.commentForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadComments();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadComments();
    }
  }

  // Métodos auxiliares para la validación
  get name() { return this.commentForm.get('name'); }
  get email() { return this.commentForm.get('email'); }
  get message() { return this.commentForm.get('message'); }
}
