import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

export interface UnidadMedida {
  _id: string;
  nombre: string;
  simbolo: string;
}

export interface PesoValor {
  _id: string;
  peso: number;
}

export interface PrecioVenta {
  PrecioVenta: {
    _id: string;
    precioUnitario: string;
    unidadMedida: UnidadMedida;
    color: {
      _id: string;
      nombreColor: string;
    };
  };
}

export interface Colores {
  _id: string;
  PrecioVenta: PrecioVenta;
  imagen: string;
  idImagen: string;
}


export interface MedidaProducto {
  _id: string;
  longitudMedida: {
      valor: number;
      unidadMedida: UnidadMedida;
  };
  peso: {
      valores: {
      _id: string;
      valor: PesoValor;
      }[];
      unidadMedida: UnidadMedida;
  };
  colores: Colores[];
}

export interface ColorDatosFormatoGetColor {
  color: string;
  precioUnitario: number;
  unidadMedida: string;
  _id: string;
  nombreColor: string;
}

export interface CompraDetalleGet {
  medidaProducto: MedidaProducto;
  color: ColorDatosFormatoGetColor;
  cantidad: number;
  total: number;
  proveedor: {
    _id: string;
    nombre: string;
  };
  producto: string;
}

interface Compra {
  _id: string;
  detalleCompra: CompraDetalleGet[];
  fechaCompra: string;
  estado: boolean;
}

interface GetComprasResponse {
  compras: Compra[];
}

export const getCompras = async (): Promise<Compra[]> => {
  try {
    const response: AxiosResponse<GetComprasResponse> = await axios2.get<GetComprasResponse>(`/api/compra`);
    return response.data.compras;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};
