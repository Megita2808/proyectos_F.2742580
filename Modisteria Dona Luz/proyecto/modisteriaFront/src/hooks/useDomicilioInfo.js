import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";
export default function useDomicilioData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllDomicilios = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/domicilios/getAllDomicilios`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllDomicilios = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/domicilios/getAllDomicilios`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateSG = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/domicilios/updateSG/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createTalla = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/tallas/createTalla`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteTalla = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/tallas/deleteTalla/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllDomicilios,
    fetchAllDomicilios,
    loading,
    updateSG,
  };
}
