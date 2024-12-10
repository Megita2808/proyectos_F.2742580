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
  _id: string;
  id_Producto: string;
  longitudMedida: LongitudMedida;
  peso: Peso;
  colores: PrecioVenta[];
}

const EditarMedidaProducto = async (
  _id: string,
  id_Producto: string,
  longitudMedida: LongitudMedida,
  peso: Peso,
  colores: { idPrecioVentaApi: string }[]
): Promise<DatosMedidaProducto | void> => {

  if (id_Producto.length < 2) {
    console.error('El id del producto debe tener al menos 2 caracteres');
    return;
  }

  if (!longitudMedida || !longitudMedida.valor || !longitudMedida.unidadMedida) {
    console.error('La longitud de la medida no está correctamente definida');
    return;
  }

  if (!peso || !peso.valor || !peso.unidadMedida) {
    console.error('El peso no está correctamente definido');
    return;
  }

  const coloresTransformados: PrecioVenta[] = colores.map((color) => ({
    PrecioVenta: color.idPrecioVentaApi,
  }));
  
  try {
    const response: AxiosResponse<DatosMedidaProducto> = await axios2.put<DatosMedidaProducto>(
      `/api/medidaProducto/${_id}`,
      {
        id_Producto,
        longitudMedida: {
          valor: longitudMedida.valor,
          unidadMedida: longitudMedida.unidadMedida,
        },
        peso: {
          valores: [{ valor: peso.valor }],
          unidadMedida: peso.unidadMedida,
        },
        colores: coloresTransformados,
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

export default EditarMedidaProducto;
