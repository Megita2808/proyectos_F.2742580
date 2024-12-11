"use client"
import React from "react";
import Swal from "sweetalert2";

export const eliminarCategoria = async (categoryId: number) => {
  try {

    const productsResponse = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/products");
    const products = await productsResponse.json();
    const productDetails = products.body;

    const isCategoryAssociated = productDetails.some(
      (product: { id_category: number }) => product.id_category === categoryId
    );

    if (isCategoryAssociated) {
      Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: "Error de validación",
        html: `Esta categoría no se puede eliminar porque está asociada a uno o más productos.`,
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
        },
      });
      return; 
    } else {

      const confirmDelete = await Swal.fire({
        title: "¿Estás seguro de que quieres eliminar esta categoría?",
        icon: "warning",
        iconColor: "#000",
        color: "#000",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#000",
        confirmButtonColor: "#6A0DAD",
        reverseButtons: true,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
          cancelButton: "rounded-xl",
          confirmButton: "rounded-xl",
        },
      });

      if (confirmDelete.isConfirmed) {
        const deleteResponse = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/categories/${categoryId}`, {
          method: 'DELETE',
        });
        if (deleteResponse.ok) {
          Swal.fire({
            icon: "success",
            iconColor: "#000",
            color: "#000",
            title: "Categoría eliminada",
            text: "La categoría ha sido eliminada correctamente.",
            timerProgressBar: true,
            showConfirmButton: false,
            timer: 3000,
            background: "url(/images/grids/bg-morado-bordes.avif)",
            customClass: {
              popup: "rounded-3xl shadow shadow-6",
              container: "custom-background",
            },
          });
          window.location.reload(); 
        } else {
          Swal.fire({
            icon: "error",
            iconColor: "#000",
            color: "#000",
            title: "Error al eliminar categoría",
            text: "Hubo un problema al intentar eliminar la categoría. Intenta nuevamente.",
            timerProgressBar: true,
            showConfirmButton: false,
            timer: 3000,
            background: "url(/images/grids/bg-morado-bordes.avif)",
            customClass: {
              popup: "rounded-3xl shadow shadow-6",
              container: "custom-background",
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    Swal.fire({
      icon: "error",
      iconColor: "#000",
      color: "#000",
      title: "Error al eliminar categoría",
      text: "Hubo un problema al intentar eliminar la categoría. Intenta nuevamente.",
      timerProgressBar: true,
      showConfirmButton: false,
      timer: 3000,
      background: "url(/images/grids/bg-morado-bordes.avif)",
      customClass: {
        popup: "rounded-3xl shadow shadow-6",
        container: "custom-background",
      },
    });
  }
};
