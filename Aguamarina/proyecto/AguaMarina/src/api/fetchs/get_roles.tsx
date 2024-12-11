import { Rol } from "@/types/admin/Rol";

export const fetchRoles = async (): Promise<Rol[]> => {
  try {
    const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/roles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error obteniendo los roles:", error);
    return [];
  }
};

export const fetchRolById = async (id: string | number): Promise<Rol> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/roles/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error obteniendo el rol:", error);
    throw error;
  }
};
