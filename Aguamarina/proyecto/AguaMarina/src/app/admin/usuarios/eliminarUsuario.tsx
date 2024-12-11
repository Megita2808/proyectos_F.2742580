import React from "react";
import Swal from "sweetalert2";

export const eliminarUsuario = async (userId: number) => {
  try {
    const reservationsResponse = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations');
    const reservations = await reservationsResponse.json();
    const reservas = reservations.body;

    console.log("Reservas:", reservas); 

    const isUserAssociated = reservas.some(
      (reservation: { id_user: number }) => reservation.id_user === userId
    );

    console.log("Usuario asociado a reservas:", isUserAssociated); 

    if (isUserAssociated) {
      Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: "Error de validación",
        html: `Este usuario no se puede eliminar porque está asociado a una o más reservas.`,
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
        title: "¿Estás seguro de que quieres eliminar este usuario?",
        text: "Este usuario no está asociado a ninguna reserva, por lo que se puede eliminar.",
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
        const deleteResponse = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/users/${userId}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          Swal.fire({
            icon: "success",
            iconColor: "#000",
            color: "#000",
            title: "Usuario eliminado",
            text: "El usuario ha sido eliminado correctamente.",
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
            title: "Error al eliminar el usuario",
            text: "Hubo un problema al intentar eliminar el usuario. Intenta nuevamente.",
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
    console.error("Error al eliminar el usuario:", error);
    Swal.fire({
      icon: "error",
      iconColor: "#000",
      color: "#000",
      title: "Error al eliminar el usuario",
      text: "Hubo un problema al intentar eliminar el usuario. Intenta nuevamente.",
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
