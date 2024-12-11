import { Perdida } from "@/types/admin/Perdida";

export const fetchLosses = async (): Promise<Perdida[]> => {
    try {
      const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/losses", {
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
      console.error("Error obteniendo las perdidas:", error);
      return [];
    }
  };



export const getLossById = async (id : string | number): Promise<Perdida> => {
    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/losses/${id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();

      return data;
    } catch (error) {
        console.error("Error obteniendo la perdida:", error);
        throw error;
    }
}

export const annularLossById = async (id : string | number): Promise<boolean> => {
    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/losses/${id}`, {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const responseJson = await response.json();
      const data = responseJson.body;
      return true;
    } catch (error) {
      console.error("Error anulando la perdida:", error);
        throw error;
    }
  }