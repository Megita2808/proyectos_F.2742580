import { Compra } from "@/types/admin/Compra";

export const fetchPurchases = async (): Promise<Compra[]> => {
  try {
    const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/purchases", {
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
    console.error("Error obteniendo las compras:", error);
    return [];
  }
};

export const fetchPurchaseById = async (id: string | number): Promise<Compra[]> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/purchases/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error obteniendo la compra:", error);
    return [];
  }
};