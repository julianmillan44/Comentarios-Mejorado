// src/app/models/comment.ts
export interface Comment {
  id?: string;
  _id?: string;
  name?: string;
  author?: string;
  email?: string;
  message?: string;
  text?: string;
  content?: string;
  createdAt?: Date | string;
  date?: Date | string;
  updatedAt?: Date | string;
  isApproved?: boolean;
  approved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  likes?: number;
  replies?: Comment[];
  avatar?: string;
}

export interface CreateCommentDto {
  name: string;
  email: string;
  message: string;
}

// src/app/models/api-response.ts
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}
