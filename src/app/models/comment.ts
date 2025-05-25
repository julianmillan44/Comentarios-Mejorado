export interface Comment {
  id: number;
  name: string;
  email: string;
  message: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentDto {
  name: string;
  email: string;
  message: string;
}
