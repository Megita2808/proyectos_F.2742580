import axios, { AxiosResponse } from 'axios';
import axios2 from '../../../../utils/axiosConfig';

interface Color {
  _id: string;
  nombreColor: string;
}

interface UnidadMedida {
  _id: string;
  nombre: string;
  simbolo: string;
  tipo: string;
}

interface datosPrecioVenta {
  _id: string;
  precioUnitario: number;
  unidadMedida: UnidadMedida | null;
  color: Color;
  estado: boolean;
}

interface equivalencia {
  unidadMedida: UnidadMedida;
  valor: number;
}

interface existencias {
  equivalencia: equivalencia;
  cantidad: number;
}

export interface PrecioVenta {
  PrecioVenta: datosPrecioVenta;
  existencias : existencias;
}

interface PesoValor {
  _id: string;
  valor: {
    _id: string;
    peso: number;
    unidadMedida: UnidadMedida;
    estado: boolean;
  } | null;
}

interface LongitudMedida {
  _id: string;
  valor: number;
  unidadMedida: UnidadMedida;
}

interface Peso {
  valores: PesoValor[];
  unidadMedida: UnidadMedida | null;
}

interface Producto {
  idProducto: string;
  nombreProducto: string;
}

export interface MedidaProducto {
  _id: string;
  longitudMedida: LongitudMedida;
  peso: Peso;
  estado: boolean;
  producto: Producto;
  colores: PrecioVenta[];
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