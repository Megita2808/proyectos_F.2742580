import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";

export default function useCategoriaDataInsumo() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();

  const fetchAllCategorias = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/categoriainsumos/getAllCategoriaInsumos`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const initialFetchAllCategorias = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/categoriainsumos/getAllCategoriaInsumos`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const updateCategoria = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/categoriainsumos/updateCategoriaInsumo/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };

  const createCategoria = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/categoriainsumos/createCategoriaInsumo`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };

  const deleteCategoria = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/categoriainsumos/deleteCategoriaInsumo/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllCategorias,
    fetchAllCategorias,
    deleteCategoria,
    createCategoria,
    updateCategoria,
    loading,
  };
}
