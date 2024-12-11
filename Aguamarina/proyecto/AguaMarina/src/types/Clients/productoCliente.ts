export type ProductoCliente = {
  id_product: number;
  name: string;
  total_quantity: number;
  price: number;
  description: string;
  id_category: number;
  category : string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  disponibility: number;
};