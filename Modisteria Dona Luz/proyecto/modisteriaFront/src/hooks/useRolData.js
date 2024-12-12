import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";
export default function userolesData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllroles = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/roles/getAllRoles`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllroles = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/roles/getAllRoles`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updaterol = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/roles/updateRol/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createrol = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/roles/createRol`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleterol = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/roles/deleteRol/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllroles,
    fetchAllroles,
    deleterol,
    createrol,
    updaterol,
    loading,
  };
}
