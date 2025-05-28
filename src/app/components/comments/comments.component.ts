import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { AppStateService } from '../../services/app-state.service';
import { Comment, CreateCommentDto } from '../../models/comment';

@Component({
  selector: 'app-comments',
  standalone: false,
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
    console.log('CommentsComponent initialized');
    this.loadComments();
  }

  loadComments(): void {
    console.log('Loading comments...');
    this.isLoading = true;

    this.commentsService.getComments(this.currentPage, this.limit).subscribe({
      next: (response) => {
        console.log('Comments response received:', response);

        // Verificar diferentes estructuras de respuesta
        if (response && response.success) {
          // Estructura con success
          this.comments = response.data || [];
          this.totalPages = response.pagination?.totalPages || 1;
          console.log('Comments loaded (success structure):', this.comments);
        } else if (response && Array.isArray(response)) {
          // Respuesta directa como array
          this.comments = response;
          this.totalPages = 1;
          console.log('Comments loaded (array structure):', this.comments);
        } else if (response && response.data && Array.isArray(response.data)) {
          // Otra estructura posible
          this.comments = response.data;
          this.totalPages = response.pagination?.totalPages || 1;
          console.log('Comments loaded (data array structure):', this.comments);
        } else {
          console.warn('Unexpected response structure:', response);
          this.comments = [];
          this.appStateService.showError('Error al procesar comentarios');
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.appStateService.showError(`Error al cargar comentarios: ${error.message}`);
        this.isLoading = false;
        this.comments = []; // Asegurar array vacío en caso de error
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

          if (response && (response.success || response.data)) {
            this.appStateService.showSuccess('¡Comentario enviado exitosamente!');
            this.commentForm.reset();

            // Recargar comentarios después de crear uno nuevo
            // Nota: Si el comentario necesita aprobación, podrías no recargarlo
            this.loadComments();
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

  // Método para debug - remover en producción
  debugComments(): void {
    console.log('Current comments:', this.comments);
    console.log('Is loading:', this.isLoading);
    console.log('Current page:', this.currentPage);
    console.log('Total pages:', this.totalPages);
  }

  // Métodos auxiliares para la validación
  get name() { return this.commentForm.get('name'); }
  get email() { return this.commentForm.get('email'); }
  get message() { return this.commentForm.get('message'); }
}
