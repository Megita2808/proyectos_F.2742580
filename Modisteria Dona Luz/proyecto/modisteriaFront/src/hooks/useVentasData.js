import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";

export default function useVentas() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { token } = useJwt();

  const fetchAllVentas = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/ventas/getAllVentas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const initialFetchAllVentas = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/ventas/getAllVentas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const calcularDomicilio = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/ventas/calcularDomicilio/${id}`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };

  const cancelarVenta = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/ventas/cancelarVenta/${id}`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    fetchAllVentas,
    cancelarVenta,
    initialFetchAllVentas,
    calcularDomicilio,
    loading,
  };
}
