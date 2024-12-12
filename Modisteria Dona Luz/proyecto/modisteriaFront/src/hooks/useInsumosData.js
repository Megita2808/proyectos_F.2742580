import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";
export default function useInsumosData() {
  const { loading, triggerFetch } = useFetch();
  const {
    loading: loadingInsumoHistorial,
    triggerFetch: fetchInsumoHistorial,
  } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllInsumos = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/insumos/getAllInsumos`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllInsumos = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/insumos/getAllInsumos`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllInsumosHistory = async () => {
    const respuesta = await fetchInsumoHistorial(
      `${URL_BACK}/insumos/getInsumoHistorial`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllInsumosControlled = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/insumos/getAllInsumos?tipo=controlado`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateInsumos = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/insumos/updateInsumo/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateCantidadInsumos = async (insumos) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/insumos/cantidadInsumos`,
      "PUT",
      insumos,
      { "x-token": token }
    );
    return respuesta;
  };
  const createInsumo = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/insumos/createInsumo`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteInsumo = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/insumos/deleteInsumo/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllInsumos,
    initialFetchAllInsumosControlled,
    fetchAllInsumos,
    deleteInsumo,
    createInsumo,
    updateInsumos,
    updateCantidadInsumos,
    loading,
    loadingInsumoHistorial,
    initialFetchAllInsumosHistory,
  };
}
