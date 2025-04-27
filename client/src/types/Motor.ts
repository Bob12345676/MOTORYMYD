export interface Motor {
  _id: string;
  name: string;
  model: string;
  description: string;
  power: number;
  voltage: number;
  current: number;
  speed: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  features: string[];
  applications: string[];
  price: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
} 