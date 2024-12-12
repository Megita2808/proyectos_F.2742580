import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";

export default function useCatalogoData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllCatalogos = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/catalogos/getAllCatalogoDash`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllCatalogos = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/catalogos/getAllCatalogoDash`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateCatalogos = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/catalogos/updateCatalogo/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createCatalogo = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/catalogos/createCatalogo`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createCatalogoInsumos = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/catalogoinsumos/createCatIns`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteCatalogo = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/catalogos/deleteCatalogo/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllCatalogos,
    fetchAllCatalogos,
    deleteCatalogo,
    createCatalogo,
    updateCatalogos,
    createCatalogoInsumos,
    loading,
  };
}
