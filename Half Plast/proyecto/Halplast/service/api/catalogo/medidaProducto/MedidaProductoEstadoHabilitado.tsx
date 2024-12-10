import axios, { AxiosResponse } from 'axios';
import axios2 from '../../../../utils/axiosConfig';

interface UnidadMedida {
  _id: string;
  nombre: string;
  simbolo: string;
  tipo: string;
}

interface LongitudMedida {
  _id: string;
  valor: number;
  unidadMedida: UnidadMedida | null;
}

interface MedidaProducto {
  _id: string;
  longitudMedida: LongitudMedida;
  estado: boolean;
}

interface GetMedidasProductoResponse {
  medidasProducto: MedidaProducto[];
}

export const getMedidaProducto = async (): Promise<MedidaProducto[]> => {
  try {
    const response: AxiosResponse<GetMedidasProductoResponse> = await axios2.get<GetMedidasProductoResponse>('/api/medidaProducto');
    return response.data.medidasProducto;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};