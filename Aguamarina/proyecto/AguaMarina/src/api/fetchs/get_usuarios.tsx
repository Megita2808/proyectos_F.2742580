import { Usuario } from "@/types/admin/Usuario";

export const fetchUsers= async (): Promise<Usuario[]> => {
  try {
    const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/users", {
      cache: "no-store",
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

export const fetchUserById = async (id: string | number): Promise<Usuario> => {
    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/users/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.body;
    } catch (error) {
      console.error("Error obteniendo el usuario:", error);
      throw error;
    }
  };
