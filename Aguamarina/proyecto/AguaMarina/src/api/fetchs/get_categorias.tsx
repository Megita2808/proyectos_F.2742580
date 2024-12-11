import { Categoria } from "@/types/admin/Categoria";

export const fetchCategories = async (): Promise<Categoria[]> => {
  try {
    const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/categories",{
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error obteniendo las categorias:", error);
    return [];
  }
};

export const fetchCategoryById = async (id: string | number): Promise<Categoria[]> => {
    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/categories/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.body;
    } catch (error) {
      console.error("Error obteniendo la categoria:", error);
      return [];
    }
  };