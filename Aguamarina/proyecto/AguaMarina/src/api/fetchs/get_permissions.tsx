import { Permiso } from "@/types/admin/Permiso";

export const fetchPermissions = async (): Promise<Permiso[]> => {
  try {
    const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/permissions", {
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
    console.error("Error obteniendo los permisos:", error);
    return [];
  }
};

export const fetchPermissionById = async (id: string | number): Promise<Permiso> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/permissions/${id}`, {
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
    console.error("Error obteniendo el permiso:", error);
    throw error;
  }
};
