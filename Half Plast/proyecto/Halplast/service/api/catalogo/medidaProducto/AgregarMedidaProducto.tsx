import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface PrecioVenta {
  PrecioVenta: string;
}

interface LongitudMedida {
  valor: number;
  unidadMedida: string;
}

interface Peso {
  valor: string;
  unidadMedida: string;
}

interface DatosMedidaProducto {
  status: number;
  msg: string;
}

const AgregarMedidaProducto = async (
  id_Producto: string, 
  longitudMedida: LongitudMedida,
  peso: Peso,
  colores: any[],
): Promise<DatosMedidaProducto | void> => {

  if (id_Producto.length < 2) {
    console.error('El producto de la medida de producto debe tener al menos 1 dígito');
    return;
  }

  const coloresTransformados: PrecioVenta[] = colores.map((color) => ({
    PrecioVenta: color.idPrecioVentaApi,
    existencias: {
      cantidad: 0,
      equivalencia: {  
        unidadMedida: color.idUnidadMedidaPrecioVenta,
        valor: 0,
      },
    },
  }));

  try {
    const response: AxiosResponse<DatosMedidaProducto> = await axios2.post<DatosMedidaProducto>('/api/medidaProducto', {
      longitudMedida: {
        valor: longitudMedida.valor,
        unidadMedida: longitudMedida.unidadMedida,
      },
      id_Producto,
      colores: coloresTransformados,
      peso: {
        valores: [{ valor: peso.valor }],
        unidadMedida: peso.unidadMedida,
      },
    });

    return {
      status: response.status,
      msg: response.data.msg
    };


  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        msg: error.response.data.error || 'Ocurrió un error en la solicitud.'
      };
    } else {
      console.error('Error desconocido:', error);
      return {
        status: 500,
        msg: 'Error desconocido en la solicitud'
      };
    }
  }
};

export default AgregarMedidaProducto;
