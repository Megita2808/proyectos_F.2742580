"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Card,
} from "@mui/material";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { checkToken } from "@/api/validations/check_cookie";
import { logOut } from "@/utils/validationsTokens";
import { fetchUserById } from "@/api/fetchs/get_usuarios";
import ListaDir from "@/components/Lista/ListaDir";
import { useAuth } from "@/context/AuthContext";


interface ClientData {
  id_user: string;
  names: string;
  lastnames: string;
  dni: string;
  mail: string;
  phone_number: string;
}

const ProfileClient: React.FC = () => {
  const [clientData, setClientData] = useState<ClientData>({
    id_user: "",
    names: "",
    lastnames: "",
    dni: "",
    mail: "",
    phone_number: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { loadPermissions, setLoadPermissions } = useAuth();
  const router = useRouter();

  const fetchClientData = async () => {
    setLoading(true);
    const { result, data } = await checkToken();

    if (result) {
      const userData = await fetchUserById(data.id_user); 
      const dataClient = {
        id_user: data.id_user,
        names: userData.names,
        lastnames: userData.lastnames,
        dni: userData.dni,
        mail: userData.mail,
        phone_number: userData.phone_number,
      };
      setClientData(dataClient);
    } else {
      await Swal.fire({
        icon: "success",
        iconColor: "#000",
        color: "#000",
        title: 'Dirección creada',
        html: "Dirección exitosamente en <b>3</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 3;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
          window.location.reload();

        },
      });
      router.push("/login");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateFields = () => {
    const { names, lastnames, phone_number, mail } = clientData;

    if (!names.trim() || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(names)) {
      let timerInterval: number | NodeJS.Timeout;
      Swal.fire({
        icon: "warning",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html:"Los nombres son obligatorios y solo deben contener letras <b>2</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 2;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
       
      });
      return false;
    }
    if (!lastnames.trim() || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(lastnames)) {
      let timerInterval: number | NodeJS.Timeout;
      Swal.fire({
        icon: "warning",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html:"Los apellidos son obligatorios y solo deben contener letras <b>2</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 2;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
       
      });
      return false;
    }

    if (!/^3\d{9}$/.test(phone_number)) {
      let timerInterval: number | NodeJS.Timeout;
      Swal.fire({
        icon: "warning",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html:"Esto no es un telefono valido <b>2</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 2;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
       
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(mail)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El correo electrónico no es válido.",
      });
      return false;
    }

    return true;
    window.location.reload();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!validateFields()) return;
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch(
        `https://api-aguamarina-mysql-v2.onrender.com/api/v2/users/${clientData.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(clientData),
        }
      );
  
      const responseJson = await response.json();
  
      if (!response.ok) {
        throw new Error(responseJson.message || "Network response was not ok");
      }
  
      if (responseJson.ok) {
        await fetchClientData();
      let timerInterval: number | NodeJS.Timeout;
      await Swal.fire({
        icon: "success",
        iconColor: "#000",
        color: "#000",
        title: 'Actualización Exitosa',
        html: "Datos actualizados exitosamente en <b>3</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 3;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
        
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseJson.message || "Error Desconocido",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el perfil.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logOut();

      if (result) {
      let timerInterval: number | NodeJS.Timeout;
      await Swal.fire({
        icon: "success",
        iconColor: "#000",
        color: "#000",
        title: 'Sesión cerrada',
        html: "Redirigiendo al inicio en <b>3</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 3;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
      setLoadPermissions(!loadPermissions);
        router.push("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cerrar la sesión. Inténtalo nuevamente.",
        });
      }
    } catch (error) {
      
    }
  };

  return (
    <Container>
      <Card 
      variant="outlined" 
      sx={{
        padding: 3, 
        marginTop: 3,
        backgroundColor: 'white', 
        color: 'black',            
        '&.dark': {
          backgroundColor: '#1a202c', 
          color: 'white',             
        },
      }}
      className="dark:bg-gray-800 dark:text-white mb-5" 
    >
        <Typography variant="h4" align="center" gutterBottom>
          Perfil del cliente
        </Typography>
        {loading ? (
          <Typography variant="h6" align="center">
            Cargando...
          </Typography>
        ) : (
          <div className="wow fadeInUp relative mx-auto max-w-[1200px] overflow-hidden rounded-lg bg-white px-8 py-14 dark:bg-dark-2 sm:px-12 md:px-[60px]" data-wow-delay=".15s">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} className="flex gap-5">
                {/* [----------------------------------------------Input nombre anterior-------------------------------------------------------------------] */}
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    id="names"
                    label="Nombres"
                    variant="outlined"
                    fullWidth
                    value={clientData.names}
                    onChange={handleChange}
                    required
                    InputProps={{
                      style: { color: "black" },}}
                    color="info"
                  />
                </Grid> */}
                {/* [----------------------------------------------Input nombre nuevo-------------------------------------------------------------------] */}
                <div className="flex flex-row gap-5 w-full">
                  <div className="mb-[22px] w-full lg:w-1/2 md:w-1/2 ">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Nombres:
                      <span className="text-red">*</span>
                        </label>
                      <input
                        id="names"
                        type="text"
                        placeholder="Nombre"
                        value={clientData.names}
                        onChange={handleChange}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        required
                      />
                  </div>

                  <div className="mb-[22px] w-full lg:w-1/2 md:w-1/2">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Apellidos:
                      <span className="text-red">*</span>
                        </label>
                      <input
                        id="lastnames"
                        type="text"
                        placeholder="Apellidos"
                        value={clientData.lastnames}
                        onChange={handleChange}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        required
                      />
                  </div>
                </div>
                {/* [----------------------------------------------------------------------------------------------------------------------] */}
               
                {/* [----------------------------------------------Input apellidos anterior-------------------------------------------------------------------] */}
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    id="lastnames"
                    label="Apellidos"
                    variant="outlined"
                    fullWidth
                    value={clientData.lastnames}
                    onChange={handleChange}
                    required
                    InputProps={{
                      style: { color: "black" },}}
                    color="info"
                  />
                </Grid> */}
                {/* [----------------------------------------------Input Apellidos nuevo-------------------------------------------------------------------] */}
                <div className="flex flex-row gap-5 w-full">
                  
                  <div className="mb-[22px] w-full lg:w-1/2 md:w-1/2">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Número de Teléfono:
                      <span className="text-red">*</span>
                        </label>
                      <input
                        id="phone_number"
                        type="number"
                        placeholder="Número de Teléfono"
                        value={clientData.phone_number}
                        onChange={handleChange}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        required
                      />
                  </div>
                  <div className="mb-[22px] w-full lg:w-1/2 md:w-1/2">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Cedula:
                      <span className="text-red">*</span>
                        </label>
                      <input
                        id="dni"
                        type="text"
                        placeholder="Cedula"
                        value={clientData.dni}
                        onChange={handleChange}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        disabled
                      />
                  </div>
                </div>
                {/* [----------------------------------------------------------------------------------------------------------------------] */}

                {/* [----------------------------------------------Input cedula anterior-------------------------------------------------------------------] */}                 
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    id="dni"
                    label="Cedula"
                    variant="outlined"
                    fullWidth
                    value={clientData.dni}
                    onChange={handleChange}
                    required
                    disabled
                    InputProps={{
                      style: { color: "black" },}}
                    color="info"
                  />
                </Grid> */}
                {/* [----------------------------------------------Input cedula nuevo-------------------------------------------------------------------] */}
                <div className="flex flex-row gap-5 w-full">
                  <div className="mb-[22px] w-full lg:w-1/2 md:w-1/2">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Correo Electrónico:
                      <span className="text-red">*</span>
                        </label>
                      <input
                        id="mail"
                        type="mail"
                        placeholder="Correo Electrónico"
                        value={clientData.mail}
                        onChange={handleChange}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        disabled
                        required
                      />
                  </div>
                </div>
                {/* [----------------------------------------------------------------------------------------------------------------------] */}
                
                {/* [----------------------------------------------Input correo anterior-------------------------------------------------------------------] */}                 
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    id="mail"
                    label="Correo Electrónico"
                    variant="outlined"
                    fullWidth
                    value={clientData.mail}
                    onChange={handleChange}
                    required
                    disabled
                    InputProps={{
                      style: { color: "black" },}}
                    color="info"
                  />
                </Grid> */}
                
                {/* [----------------------------------------------Input cedula nuevo-------------------------------------------------------------------] */}
                
                  {/* [----------------------------------------------------------------------------------------------------------------------] */}

                  {/* [----------------------------------------------Input celular anterior-------------------------------------------------------------------] */}                 
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    id="phone_number"
                    label="Número de Teléfono"
                    variant="outlined"
                    fullWidth
                    value={clientData.phone_number}
                    onChange={handleChange}
                    required
                    InputProps={{
                      style: { color: "black" },}}
                    color="info"
                  />
                </Grid> */}
                {/* [----------------------------------------------Input celular nuevo-------------------------------------------------------------------] */}
                
              </Grid>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                {/* <Button
                  className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition duration-300 hover:bg-primary/90 lg:mt-0"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar"}
                </Button> */}
                <button
                  onClick={handleSubmit}
                  className="absolute bottom-4 right-4 cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white"
                  // className="absolute bottom-4 right-4 cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-4 py-3 text-m text-white transition duration-300 ease-in-out hover:bg-primary/90"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar Información"}
                </button>
                  
                <Button
                  className="absolute bottom-4 left-4 cursor-pointer items-center justify-center rounded-md border border-red-500 bg-red-500 px-4 py-3 text-m text-white transition duration-300 ease-in-out hover:bg-red-90"onClick={handleLogout}
                  >
                  Cerrar sesión
                </Button>
              </div>
            </form>
          </div>
        )}
      </Card>

      {loading ? (
        <></>
      ):
      (
        <Card 
        variant="outlined" 
        sx={{
          padding: 3, 
          marginTop: 3,
          backgroundColor: 'white', 
          color: 'black',            
          '&.dark': {
            backgroundColor: '#1a202c', 
            color: 'white',             
          },
        }}
        className="dark:bg-gray-800 dark:text-white mb-10" 
      >
        <Typography variant="h4" align="center" gutterBottom>
          Mis Direcciones
        </Typography>
        
        <ListaDir id_user={clientData.id_user}/>
      </Card>
      )
    }
      

    </Container>
  );
};

export default ProfileClient;
