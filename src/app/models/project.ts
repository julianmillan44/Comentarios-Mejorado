export interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  shortDescription?: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface ProjectCardData extends Project {
  status?: 'completed' | 'in-progress' | 'planned';
  date?: Date;
  duration?: string;
  stars?: number;
  forks?: number;
  tags?: string[];
  image?: string;
  demo?: string;
  github?: string;
}
