import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";
export default function useProveedoresData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllProveedores = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/proveedores/getAllProveedores`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllProveedores = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/proveedores/getAllProveedores`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateProveedores = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/proveedores/updateProveedor/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createProveedores = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/proveedores/createProveedor`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteProveedores = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/proveedores/deleteProveedor/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllProveedores,
    fetchAllProveedores,
    deleteProveedores,
    createProveedores,
    updateProveedores,
    loading,
  };
}
