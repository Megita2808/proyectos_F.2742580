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

const AgregarMedidaVenta = async (
  id_MedidaProducto: string, 
  longitudMedida: LongitudMedida,
  peso: PesoMedidaVenta,
  colores: Colores[],
): Promise<DatoMedidaVenta | void> => {

  if (id_MedidaProducto.length < 1 || longitudMedida.valor <= 0 || peso.valores.length === 0 || colores.length === 0) {
    console.error('Los datos de la medida de venta son inválidos');
    return;
  }
  try {
    const response: AxiosResponse<DatoMedidaVenta> = await axios2.post<DatoMedidaVenta>('/api/medidaVenta' ,
      {
        id_MedidaProducto,
        longitudMedida,
        peso,
        colores
      }
    );
    return response.data;
  }
   catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default AgregarMedidaVenta;
