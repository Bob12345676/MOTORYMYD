export interface Motor {
  _id: string;
  name: string;
  description: string;
  price: number;
  power: number;
  weight: number;
  available: boolean;
  imageUrl?: string;
  category: string;
  manufacturer: string;
  specifications: Record<string, string | number>;
  createdAt: string;
  updatedAt: string;
} 