export type Producto = {
  id_product: number;
  name: string;
  total_quantity: number;
  price: string;
  description: string;
  id_category: number;
  category : string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  disponibility: number;
};