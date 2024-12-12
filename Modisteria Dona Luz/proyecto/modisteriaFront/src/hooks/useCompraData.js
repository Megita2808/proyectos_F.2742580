import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";
export default function useComprasData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllCompras = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/compras/getAllCompras`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllCompras = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/compras/getAllCompras`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateCompra = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/compras/updateUser/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createCompra = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/compras/createCompra`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteCompra = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/compras/deleteUser/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllCompras,
    fetchAllCompras,
    deleteCompra,
    createCompra,
    updateCompra,
    loading,
  };
}
