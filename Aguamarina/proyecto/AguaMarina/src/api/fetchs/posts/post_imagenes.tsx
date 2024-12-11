export const postImagenes = async (producto: any, images: any)  => {
    const id_product = producto.id_product;
    const arrayImages = images.map((img: any) => ({id_product, path_image: img.url}))
    try {
      const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
            arrayImages
          ),
        cache: "no-store",
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.body;
    } catch (error) {
      console.error("Error Creando las imagenes:", error);
      return error;
    }
  };