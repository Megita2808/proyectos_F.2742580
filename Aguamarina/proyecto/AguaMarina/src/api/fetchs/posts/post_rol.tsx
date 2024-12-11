export const postRol = async (formData: any) => {
    try {
      const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        cache: "no-store",
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.body;
    } catch (error) {
      console.error("Error creando el rol:", error);
      throw error;
    }
  };