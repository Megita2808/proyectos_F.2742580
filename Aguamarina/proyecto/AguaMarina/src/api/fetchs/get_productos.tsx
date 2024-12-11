import { Producto } from "@/types/admin/Producto";

export const fetchProducts = async (start_date?: any, end_date?: any): Promise<Producto[]> => {
  try {
    const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        start_date,
        end_date
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error obteniendo los productos:", error);
    return [];
  }
};

export const fetchProductById = async (id: string | number): Promise<Producto> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error obteniendo el producto:", error);
    throw error;
  }
};
