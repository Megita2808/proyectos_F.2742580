import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface LongitudMedida {
  valor: number;
  unidadMedida: string;
}

interface PesoMedidaVenta {
  valores: { valor: string }[];
  unidadMedida: string;
}

interface Colores {
  PrecioVenta: string;
  imagen: string ;
}

interface DatoMedidaVenta {
  id_MedidaProducto: string;
  longitudMedida: LongitudMedida;
  peso: PesoMedidaVenta;
  colores: Colores[];
}

const EditarMedidaVenta = async (
  _id: string,
  id_MedidaProducto: string, 
  longitudMedida: LongitudMedida,
  peso: PesoMedidaVenta,
  colores: Colores[],
): Promise<DatoMedidaVenta | void> => {

  if (longitudMedida.valor < 1) { 
    console.error('La longitud de la meddia de venta debe tener al menos 1 digito');
    return
  }
  try {
    const response: AxiosResponse<DatoMedidaVenta> = await axios2.put<DatoMedidaVenta>(
      `/api/medidaVenta/${_id}`,
      {
        id_MedidaProducto,
        longitudMedida,
        peso,
        colores
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EditarMedidaVenta;
