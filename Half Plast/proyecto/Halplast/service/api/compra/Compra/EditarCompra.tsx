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
  _id: string;
  precioUnitario: string;
  unidadMedida: UnidadMedida;
  color: {
      _id: string;
      nombreColor: string;
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

export interface CompraDetalle {
  medidaProducto: MedidaProducto;
  color: PrecioVenta;
  cantidad: number;
  total: number;
  proveedor: {
    _id: string;
    nombre: string;
  };
}

interface DatoCompra {
  detalleCompra: CompraDetalle[];
  estado?: boolean;
}

const EditarCompra = async (
  _id: string,
  detalleCompra: CompraDetalle[],
): Promise<DatoCompra | void> => {

  try {
    const response: AxiosResponse<DatoCompra> = await axios2.put<DatoCompra>('/api/compra/'+_id, {
      detalleCompra,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EditarCompra;
