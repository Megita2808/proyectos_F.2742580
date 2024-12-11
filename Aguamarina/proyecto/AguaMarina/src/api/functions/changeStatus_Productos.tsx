const cambiar_estado_productos = async (id_product: number): Promise<boolean> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/products/${id_product}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    return data.body?.isPatched || false;
  } catch (error) {
    console.error("Error obteniendo los productos:", error);
    return false;
  }
};

export default cambiar_estado_productos;