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

interface equivalencia {
  unidadMedida: UnidadMedida;
  valor: number;
}

interface existencias {
  equivalencia: equivalencia;
  cantidad: number;
}

export interface PrecioVenta {
  _id: string;
  precioUnitario: number;
  unidadMedida: UnidadMedida | null;
  color: Color;
  estado: boolean;
}

export interface PesoValor {
  _id: string;
  peso: number;
  unidadMedida: UnidadMedida;
  estado: boolean;
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

interface ColoresPrecioVentaPersonalizado {
  _id: string;
  PrecioVenta: PrecioVenta;
  existencias : existencias;
}

interface Colores {
  _id: string;
  PrecioVenta: PrecioVenta;
  imagen: string;
  idImagen: string;
}

export interface MedidaVenta {
  _id: string;
  longitudMedida: {
      valor: number;
      unidadMedida: UnidadMedida;
  };
  peso: {
      valores:[{
        _id: string;
        valor: PesoValor;
      }];
      unidadMedida: UnidadMedida;
  };
  colores: Colores[];
}


export interface MedidaProducto {
  _id: string;
  longitudMedida: LongitudMedida;
  peso: Peso;
  estado: boolean;
  producto: Producto;
  colores: ColoresPrecioVentaPersonalizado[];
  medidaVenta: MedidaVenta[];
}

interface GetMedidasProductoResponse {
  medidasProducto: MedidaProducto[];
}

export const getMedidaProducto = async (): Promise<MedidaProducto[]> => {
  try {
    const response: AxiosResponse<GetMedidasProductoResponse> = await axios2.get<GetMedidasProductoResponse>('/api/medidaProducto/medidasVenta');
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