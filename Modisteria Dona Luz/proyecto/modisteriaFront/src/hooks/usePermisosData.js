import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";
export default function usePermisosData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllPermisos = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/permisos/getAllPermisos`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllPermisos = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/permisos/getAllPermisos`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updatePermisos = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/permisos/updatePermiso/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deletePermisos = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/permisos/deletePermiso/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllPermisos,
    fetchAllPermisos,
    deletePermisos,
    updatePermisos,
    loading,
  };
}
