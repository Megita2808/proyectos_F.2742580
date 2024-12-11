export const putUser = async (id: number, updatedUser: any) => {
    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
        cache: "no-store",
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error actualizando el usuario:", error);
      throw error;
    }
  };
  