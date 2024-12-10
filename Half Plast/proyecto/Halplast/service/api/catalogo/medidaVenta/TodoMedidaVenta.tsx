import axios, { AxiosResponse } from 'axios';
import axios2 from '../../../../utils/axiosConfig';

interface UnidadMedida {
  _id: string;
  nombre: string;
  simbolo: string;
}

interface PesoValor {
  _id: string;
  peso: number;
}

interface Peso {
  valores: [{
    valor: PesoValor;
    _id: string;
  }];
  unidadMedida: UnidadMedida;
}

interface PrecioVenta {
  _id: string;
  precioUnitario: number;
  unidadMedida: UnidadMedida;
  color: {
    _id: string;
    nombreColor: string;
  };
}

interface Color {
  PrecioVenta: PrecioVenta;
  imagen: string;
  _id: string;
  idImagen: string;
}

interface LongitudMedida {
  valor: number;
  unidadMedida: UnidadMedida;
}

interface MedidaProducto {
  idMedidaProducto: string;
  longitudMedida: LongitudMedida;
}

export interface MedidaVenta {
  _id: string;
  longitudMedida: LongitudMedida;
  peso: Peso;
  colores: Color[];
  estado: boolean;
  medidaProducto: MedidaProducto;
}

interface GetMedidasVentaResponse {
  medidasVenta: MedidaVenta[];
}

export const getMedidasVenta = async (): Promise<MedidaVenta[]> => {
  try {
    const response: AxiosResponse<GetMedidasVentaResponse> = await axios2.get<GetMedidasVentaResponse>('/api/medidaVenta');
    return response.data.medidasVenta;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};
