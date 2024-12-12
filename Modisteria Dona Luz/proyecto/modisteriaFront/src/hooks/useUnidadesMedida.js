import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";

export default function useUnidadesMedida() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllUnidades = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/unidadesDeMedida/getAllUnidadDeMedidas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllUnidades = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/unidadesDeMedida/getAllUnidadDeMedidas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateUnidades = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/unidadesDeMedida/updateUnidadDeMedida/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createUnidades = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/unidadesDeMedida/createUnidadDeMedida`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteUnidades = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/unidadesDeMedida/deleteUnidadDeMedida/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllUnidades,
    createUnidades,
    fetchAllUnidades,
    updateUnidades,
    deleteUnidades,
    loading,
  };
}
