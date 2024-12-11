import Swal from "sweetalert2";
import { fetchCities } from "@/api/fetchs/get_ciudades";
import { fetchReservations } from "@/api/fetchs/get_reservas";

export const eliminarMunicipio = async (city: any, data : any) => {

  try {
    const reservations = await fetchReservations();

    const isCityAssociated = reservations.some(
      (res: { city: string }) => res.city === city.name
    );

    if (isCityAssociated) {
      Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: "Error de validación",
        html: `Este municipio no se puede eliminar porque está asociado a una o más reservas.`,
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
        title: "¿Estás seguro de que quieres eliminar este municipio?",
        icon: "warning",
        iconColor: "#000",
        showCancelButton: true,
        confirmButtonColor: "#6A0DAD",
        cancelButtonColor: "#000",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons : true,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
          cancelButton: "rounded-xl",
          confirmButton: "rounded-xl",
        },
      });

      if (confirmDelete.isConfirmed) {
        const deleteResponse = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/cities/${city.id_city}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          Swal.fire({
            icon: "success",
            iconColor: "#000",
            color: "#000",
            title: "Municipio eliminado",
            text: "El municipio ha sido eliminado correctamente.",
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
            title: "Error al eliminar municipio",
            text: "Hubo un problema al intentar eliminar el municipio. Intenta nuevamente.",
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
    console.error("Error al eliminar el municipio:", error);
    Swal.fire({
      icon: "error",
      iconColor: "#000",
      color: "#000",
      title: "Error al eliminar municipio",
      text: "Hubo un problema al intentar eliminar el municipio. Intenta nuevamente.",
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
