import { setCookieToken } from "@/utils/validationsTokens";
import { fetchUserById } from "../fetchs/get_usuarios";
import Swal from "sweetalert2";

export const validateLogin = async (formData: any, setLoadingLogin: any) => {
  setLoadingLogin(true);
  console.log("Trantado de iniciar")
  console.log("paso 2")
    try {
      console.log("trata")
        const response = await fetch(
          "https://api-aguamarina-mysql-v2.onrender.com/api/v2/validate_login",
          {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ mail: formData.mail, password: formData.password }),
          }
        );
        console.log("Paso la prueba")
        const responseJson = await response.json();
        
  
        if (!response.ok) {
          const errorMessage = responseJson.message || "No hay un usuario con los datos ingresados";
          throw new Error(errorMessage);
        }
        console.log("Entra")
        if (responseJson.logged) {
          await setCookieToken(responseJson.token);
          
          const payload = responseJson.data;
          const dataUser = await fetchUserById(payload.id_user);
          setLoadingLogin(false);
          
  
          // if (payload && dataUser.accessDashboard === true) {
          //   //Inicio Sesión con permiso a Dashboard
          //   await Swal.fire({
          //     icon: "success",
          //     title: "Bienvenido, tienes acceso al Dashboard, pasa",
          //     text: "Acceso concedido.",
          //     confirmButtonColor: "#0000ff",
          //   });
          //   // router.push("/admin");
          // } else {
          //   //Inicio Sesión Clientes
          //   await Swal.fire({
          //     icon: "success",
          //     title: "Inicio de sesión exitoso",
          //     text: "Redirigiendo a la página de inicio...",
          //   });
          // }
  
        //   toast.success("Login successful");
        //   router.push("/");
            return {data : dataUser, result : true};
        } else {
          const errorMessage = responseJson.message || "Error Desconocido";
        //   toast.error(errorMessage);
        //   await Swal.fire({
        //     icon: "error",
        //     title: "Error",
        //     text: errorMessage,
        //     confirmButtonColor: "#0000ff",
        //   });
        return {result : false}
        }
      } catch (error: any) {
        console.error("Error:", error);
        // await Swal.fire({
        //   icon: "error",
        //   title: "Error",
        //   text: error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.",
        //   confirmButtonColor: "#0000ff",
        // });
        return {result : false}
      } finally {
        setLoadingLogin(false);
      }
  };