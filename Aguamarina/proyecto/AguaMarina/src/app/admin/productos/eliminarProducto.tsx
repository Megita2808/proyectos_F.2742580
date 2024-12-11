import React from "react";
import Swal from "sweetalert2";

export const eliminarProducto = async (productId: number) => {
  try {
    const reservationDetailsResponse = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservationdetails');
    const reservationDetails = await reservationDetailsResponse.json();
    const detalles =  reservationDetails.body

    const isProductAssociated = detalles.some(
      (detail: { id_product: number }) => detail.id_product == productId
    );

    if (isProductAssociated) {

      Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: "Error de validación",
        html: `Este producto no se puede eliminar porque está asociado a una o más reservas.`,
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
      // title: "¿Estás seguro?",
      // text: "¿Estás seguro de que deseas finalizar tu reserva?",
      // iconColor: "#000",
      // color: "#000",
      // icon: "warning",
      // showCancelButton: true,
      // cancelButtonColor: "#000",
      // confirmButtonColor: "#6A0DAD",
      // confirmButtonText: "Confirmar",
      // cancelButtonText: "Cancelar",
      // reverseButtons: true,
      // background: "url(/images/grids/bg-morado-bordes.avif)",
      // customClass: {
      //   popup: "rounded-3xl shadow shadow-6",
      //   container: "custom-background",
      //   cancelButton: "rounded-xl",
      //   confirmButton: "rounded-xl",
      // },
      const confirmDelete = await Swal.fire({
        title: "¿Estás seguro de que quieres eliminar este producto?",
        text: "Este producto no está asociado a ninguna reserva, por lo que se puede eliminar.",
        icon: "warning",
        iconColor: "#000",
        showCancelButton: true,
        confirmButtonColor: "#6A0DAD",
        cancelButtonColor: "#000",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, eliminar",
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
        const deleteResponse = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/products/${productId}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          Swal.fire({
            icon: "success",
            iconColor: "#000",
            color: "#000",
            title: "Producto eliminado",
            text: "El producto ha sido eliminado correctamente.",
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
            title: "Error al eliminar producto",
            text: "Hubo un problema al intentar eliminar el producto. Intenta nuevamente.",
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
    console.error("Error al eliminar el producto:", error);
    Swal.fire({
      icon: "error",
      iconColor: "#000",
      color: "#000",
      title: "Error al eliminar producto",
      text: "Hubo un problema al intentar eliminar el producto. Intenta nuevamente.",
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
