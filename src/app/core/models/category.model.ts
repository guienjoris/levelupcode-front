export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  orderIndex: number;
  tags?: Tag[];
  lessonsCount?: number;
  quizzesCount?: number;
}
