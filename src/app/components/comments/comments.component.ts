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
        console.log('Raw comments response:', response);

        try {
          // Manejar diferentes estructuras de respuesta
          if (response && response.success !== undefined) {
            // Estructura estándar con success
            if (response.success) {
              this.comments = response.data || [];
              this.totalPages = response.pagination?.totalPages || 1;
              console.log('Comments loaded successfully:', this.comments);
            } else {
              console.warn('Response indicates failure:', response.message);
              this.comments = [];
              this.appStateService.showError(response.message || 'Error al cargar comentarios');
            }
          } else if (Array.isArray(response)) {
            // Respuesta directa como array
            this.comments = response;
            this.totalPages = 1;
            console.log('Comments loaded as array:', this.comments);
          } else if (response && response.data && Array.isArray(response.data)) {
            // Otra estructura posible
            this.comments = response.data;
            this.totalPages = response.pagination?.totalPages || 1;
            console.log('Comments loaded from data property:', this.comments);
          } else {
            console.warn('Unexpected response structure:', response);
            this.comments = [];
          }

          // Verificar si hay comentarios pero están pendientes de aprobación
          if (this.comments.length === 0) {
            console.log('No comments found, checking if there are pending comments...');
            this.checkPendingComments();
          }

        } catch (error) {
          console.error('Error processing comments response:', error);
          this.comments = [];
          this.appStateService.showError('Error al procesar comentarios');
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.comments = [];
        this.isLoading = false;

        // Mensaje de error más específico
        let errorMessage = 'Error al cargar comentarios';
        if (error.message.includes('conectar')) {
          errorMessage = 'No se puede conectar con el servidor. Verifica que esté ejecutándose.';
        } else if (error.status === 404) {
          errorMessage = 'Endpoint de comentarios no encontrado';
        }

        this.appStateService.showError(errorMessage);
      }
    });
  }

  // Método auxiliar para verificar comentarios pendientes
  checkPendingComments(): void {
    this.commentsService.getPendingComments().subscribe({
      next: (response) => {
        if (response && response.success && response.data && response.data.length > 0) {
          console.log(`Found ${response.data.length} pending comments`);
          this.appStateService.showInfo(`Hay ${response.data.length} comentarios pendientes de aprobación`);
        }
      },
      error: (error) => {
        console.log('Could not check pending comments:', error);
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
            this.appStateService.showSuccess('¡Comentario enviado exitosamente! Está pendiente de aprobación.');
            this.commentForm.reset();

            // Opcional: recargar comentarios solo si el comentario fue aprobado automáticamente
            if (response.data?.approved) {
              this.loadComments();
            }
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

  // Método de utilidad para aprobar todos los comentarios (solo para testing)
  approveAllCommentsForTesting(): void {
    if (confirm('¿Estás seguro de que quieres aprobar todos los comentarios pendientes? (Solo para testing)')) {
      this.commentsService.approveAllForTesting().subscribe({
        next: (response) => {
          console.log('Approve all response:', response);
          if (response && response.success) {
            this.appStateService.showSuccess(`${response.data?.modifiedCount || 0} comentarios aprobados`);
            this.loadComments(); // Recargar comentarios
          } else {
            this.appStateService.showError('Error al aprobar comentarios');
          }
        },
        error: (error) => {
          console.error('Error approving all comments:', error);
          this.appStateService.showError('Error al aprobar comentarios');
        }
      });
    }
  }

  // Método para debug - remover en producción
  debugComments(): void {
    console.log('=== DEBUG COMMENTS ===');
    console.log('Current comments:', this.comments);
    console.log('Is loading:', this.isLoading);
    console.log('Current page:', this.currentPage);
    console.log('Total pages:', this.totalPages);
    console.log('Comments length:', this.comments?.length || 0);
    console.log('=== END DEBUG ===');
  }

  // Métodos auxiliares para la validación
  get name() { return this.commentForm.get('name'); }
  get email() { return this.commentForm.get('email'); }
  get message() { return this.commentForm.get('message'); }
}
