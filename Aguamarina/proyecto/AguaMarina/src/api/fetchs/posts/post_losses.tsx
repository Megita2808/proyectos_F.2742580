import axios from 'axios';

export const postLosses = async (formData: any) => {
  try {
    const response = await axios.post(
      "https://api-aguamarina-mysql-v2.onrender.com/api/v2/losses",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },// Aunque axios no utiliza 'cache', este se ignora en la configuración
      }
    );

    return response.data.body;
  } catch (error : any) {
    console.error("Error creando la pérdida:", error);
    // Extraer y arrojar información del error si es posible
    throw error.response?.data || error;
  }
};
