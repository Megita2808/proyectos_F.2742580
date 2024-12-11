// Archivo: src/api/fetchs/update_product.ts

export const updateProduct = async (productId: number, updatedProductData: any) => {
    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProductData), 
      });
  
      if (!response.ok) { 
        throw new Error("Error al actualizar el producto");
      }
  
      const data = await response.json(); 
      return data; 
    } catch (error) {
      console.error("Error en updateProduct:", error); 
      throw error; 
    }
  };
  