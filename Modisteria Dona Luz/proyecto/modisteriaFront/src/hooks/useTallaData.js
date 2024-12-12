import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";
export default function useTallaData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllTallas = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/tallas/getAllTallas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllTallas = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/tallas/getAllTallas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateTalla = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/tallas/updateTalla/${id}`,
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
    initialFetchAllTallas,
    fetchAllTallas,
    deleteTalla,
    createTalla,
    updateTalla,
    loading,
  };
}
