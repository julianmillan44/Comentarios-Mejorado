import { Component } from '@angular/core';
import { CreateContactDto } from '../../models/contact';

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  link?: string;
}

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
}

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: CreateContactDto = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  contactInfo: ContactInfo[] = [
    {
      icon: 'icon-mail',
      label: 'Email',
      value: 'tu@email.com',
      link: 'mailto:tu@email.com'
    },
    {
      icon: 'icon-phone',
      label: 'Teléfono',
      value: '+34 123 456 789',
      link: 'tel:+34123456789'
    },
    {
      icon: 'icon-map-pin',
      label: 'Ubicación',
      value: 'Madrid, España'
    },
    {
      icon: 'icon-clock',
      label: 'Disponibilidad',
      value: 'Lun - Vie, 9:00 - 18:00'
    }
  ];

  socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      icon: 'icon-github',
      url: 'https://github.com/tu-usuario',
      color: '#333'
    },
    {
      name: 'LinkedIn',
      icon: 'icon-linkedin',
      url: 'https://linkedin.com/in/tu-perfil',
      color: '#0077b5'
    },
    {
      name: 'Twitter',
      icon: 'icon-twitter',
      url: 'https://twitter.com/tu-usuario',
      color: '#1da1f2'
    },
    {
      name: 'Instagram',
      icon: 'icon-instagram',
      url: 'https://instagram.com/tu-usuario',
      color: '#e4405f'
    }
  ];

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';

    // Simulación de envío de formulario
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.submitMessage = '¡Mensaje enviado correctamente! Te responderé pronto.';
      this.resetForm();

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        this.submitMessage = '';
        this.submitSuccess = false;
      }, 5000);
    }, 2000);
  }

  validateForm(): boolean {
    const { name, email, subject, message } = this.contactForm;

    if (!name.trim()) {
      this.showError('Por favor, ingresa tu nombre.');
      return false;
    }

    if (!email.trim() || !this.isValidEmail(email)) {
      this.showError('Por favor, ingresa un email válido.');
      return false;
    }

    if (!subject.trim()) {
      this.showError('Por favor, ingresa un asunto.');
      return false;
    }

    if (!message.trim()) {
      this.showError('Por favor, escribe tu mensaje.');
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(message: string): void {
    this.submitSuccess = false;
    this.submitMessage = message;

    setTimeout(() => {
      this.submitMessage = '';
    }, 3000);
  }

  resetForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

  onInputChange(field: keyof CreateContactDto, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.contactForm[field] = target.value;
  }
}
