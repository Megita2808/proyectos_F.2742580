import React from "react";
import Swal from "sweetalert2";
import toast, { Toaster } from 'react-hot-toast';

export const eliminarRol = async (rolId: number, setChange : any) => {
  try {
    const usuariosResponse = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/users');
    const usuarios = await usuariosResponse.json();
    const listaUsuarios = usuarios.body;

    const isRolAssociated = listaUsuarios.some(
      (usuario: { id_rol: number }) => usuario.id_rol == rolId
    );

    if (rolId == 1 || rolId == 2) {
      Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: "Error de Permisos",
        html: `No puedes eliminar este Rol ya que está protegido por AguaMarina`,
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        confirmButtonColor: "#000",
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
        },
      });
      return; 
    }

    if (isRolAssociated) {
      Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: "Error de validación",
        html: `Este rol no se puede eliminar porque está asociado a uno o más usuarios.`,
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        confirmButtonColor: "#000",
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
        title: "¿Estás seguro de que quieres eliminar este rol?",
        text: "Este rol no está asociado a ningún usuario, por lo que se puede eliminar.",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#000",
        confirmButtonColor: "#000",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
          cancelButton: "rounded-xl",
          confirmButton: "rounded-xl",
        },
      });

      if (confirmDelete.isConfirmed) {
        const deleteResponse = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/roles/${rolId}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          toast.success("El rol ha sido eliminado correctamente.")
          // Swal.fire({
          //   icon: "success",
          //   iconColor: "#000",
          //   color: "#000",
          //   title: "Rol eliminado",
          //   text: "El rol ha sido eliminado correctamente.",
          //   timerProgressBar: true,
          //   showConfirmButton: false,
          //   timer: 3000,
          //   background: "url(/images/grids/bg-morado-bordes.avif)",
          //   customClass: {
          //     popup: "rounded-3xl shadow shadow-6",
          //     container: "custom-background",
          //   },
          // });
          setChange(true);
        } else {
          Swal.fire({
            icon: "error",
            iconColor: "#000",
            color: "#000",
            title: "Error al eliminar rol",
            cancelButtonColor: "#000",
            confirmButtonColor: "#000",
            text: "Hubo un problema al intentar eliminar el rol. Intenta nuevamente.",
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
    console.error("Error al eliminar el rol:", error);
    Swal.fire({
      icon: "error",
      iconColor: "#000",
      color: "#000",
      title: "Error al eliminar rol",
      cancelButtonColor: "#000",
      confirmButtonColor: "#000",
      text: "Hubo un problema al intentar eliminar el rol. Intenta nuevamente.",
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
  <Toaster position="bottom-right" reverseOrder={false} />
};
