// src/app/components/contact/contact.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { AppStateService } from '../../services/app-state.service';
import { CreateContactDto } from '../../models/contact';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  showDebugInfo = false;
  lastResponse: any = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private appStateService: AppStateService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    console.log('ContactComponent initialized');

    // Solo mostrar debug en desarrollo
    this.showDebugInfo = !environment.production;
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const contactData: CreateContactDto = this.contactForm.value;

      console.log('Submitting contact form:', contactData);

      this.contactService.createContact(contactData).subscribe({
        next: (response) => {
          console.log('Contact form response:', response);
          this.lastResponse = response;

          if (response && response.success) {
            // Éxito
            this.appStateService.showSuccess(
              '¡Mensaje enviado exitosamente! Te responderé pronto.'
            );

            // Limpiar formulario
            this.contactForm.reset();

            // Marcar campos como no tocados
            this.markFormGroupUntouched();

          } else {
            // Error en la respuesta
            const errorMessage = response.message || 'Error al enviar el mensaje';
            this.appStateService.showError(errorMessage);

            if (response.errors && response.errors.length > 0) {
              console.error('Validation errors:', response.errors);
            }
          }

          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error sending contact form:', error);
          this.lastResponse = error;

          let errorMessage = 'Error al enviar el mensaje';

          if (error.status === 0) {
            errorMessage = 'No se puede conectar con el servidor. Verifica que esté ejecutándose.';
          } else if (error.status === 400) {
            errorMessage = 'Datos inválidos. Revisa los campos del formulario.';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
          } else if (error.message) {
            errorMessage = `Error: ${error.message}`;
          }

          this.appStateService.showError(errorMessage);
          this.isSubmitting = false;
        }
      });
    } else {
      // Formulario inválido - marcar campos como tocados para mostrar errores
      this.markFormGroupTouched();
      this.appStateService.showWarning('Por favor completa todos los campos requeridos');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private markFormGroupUntouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.markAsUntouched();
      }
    });
  }

  toggleDebug(): void {
    this.showDebugInfo = !this.showDebugInfo;
    console.log('Debug panel toggled:', this.showDebugInfo);
  }

  // Getters para fácil acceso a los controles del formulario
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }
}
