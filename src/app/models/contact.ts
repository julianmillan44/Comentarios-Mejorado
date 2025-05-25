export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface CreateContactDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}
