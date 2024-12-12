import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";
export default function useUsuariosData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllUsuarios = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/usuarios/getAllUsers`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllUsuarios = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/usuarios/getAllUsers`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateUsuario = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/usuarios/updateUser/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createUsuario = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/usuarios/createUsuario`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteUsuario = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/usuarios/deleteUser/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllUsuarios,
    fetchAllUsuarios,
    deleteUsuario,
    createUsuario,
    updateUsuario,
    loading,
  };
}
