// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  unit: string;
  sku?: string;
  imageUrl?: string;
  images?: string[];
  categoryId: string;
  category?: Category;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
