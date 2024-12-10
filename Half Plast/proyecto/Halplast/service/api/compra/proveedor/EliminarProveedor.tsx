import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface RespuestaProveedor {
  status: number;
  msg: string;
}

const EliminarProveedor = async (
  _id: string
): Promise<RespuestaProveedor | void> => {
  if (typeof _id !== 'string') {
    console.error('El id debe ser string');
    return;
  }

  try {
    const response: AxiosResponse<RespuestaProveedor> = await axios2.delete<RespuestaProveedor>('/api/proveedor/' + _id);

    const { status, msg } = response.data;
    return { status, msg };
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

export default EliminarProveedor;
