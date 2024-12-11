import type { Ciudad } from "@/types/admin/Ciudad";

export const fetchCities = async (): Promise<Ciudad[]> => {
try {
    const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/cities", {
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
    console.error("Error obteniendo los productos:", error);
    return [];
}
};

export const fetchCityById = async (id: string | number): Promise<Ciudad> => {
try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/cities/${id}`, {
    cache: "no-store",
    });

    if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.body;
} catch (error) {
    console.error("Error obteniendo la ciudad:", error);
    throw error;
}
};