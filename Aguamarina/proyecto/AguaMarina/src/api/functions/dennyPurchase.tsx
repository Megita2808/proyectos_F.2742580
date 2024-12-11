const dennyPurchase = async (id_purchase: number): Promise<boolean> => {
    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/purchases/${id_purchase}`, {
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
      console.error("Error anulando la Entrada:", error);
      return false;
    }
  };
  
  export default dennyPurchase;