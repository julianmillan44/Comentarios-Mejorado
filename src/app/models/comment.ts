export interface Comment {
  id: number;
  name: string;
  email: string;
  message: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Extended properties for comment display
  author?: string;
  date?: Date;
  avatar?: string;
  likes?: number;
}

export interface CreateCommentDto {
  name: string;
  email: string;
  message: string;
}

export interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
  isReply?: boolean;
  parentId?: number;
}

export interface NewCommentForm extends CreateCommentDto {
  parentId?: number;
}
