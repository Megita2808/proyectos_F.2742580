import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

export interface FormatoDatoEstado {
  motivo: string;
  descripcion: string;
  timestamp: Date;
}

export interface DatosResponseEstado {
  id_envio: string | null;
  id_venta: string | null;
  EstadoEnvio: FormatoDatoEstado;
}

export const ObtenerDatosEstadoUnico = async (
  id_envio: string, 
  id_venta: string
): Promise<DatosResponseEstado | null> => {
  if (!id_envio && !id_venta) {
    console.error('Necesitas una venta o envío a la cual hacerle cambios');
    return null;
  }

  try {
    const response: AxiosResponse<DatosResponseEstado> = await axios2.post<DatosResponseEstado>(
      '/api/obtenerEstado/unicoDocumento',
      { id_envio, id_venta }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      if (statusCode === 404) {
        console.warn('No se encontró ningún estado de envío para el identificador proporcionado.');
      } else if (statusCode === 500) {
        console.warn('Ocurrió un error al obtener el estado de envío. Por favor, intente nuevamente más tarde.');
      } else if (statusCode === 400) {
        console.warn('Debe proporcionar al menos un identificador: Venta o Envio.');
      }  else {
        console.error('Error en la solicitud Axios:', error.message);
      }

      console.debug('Detalles del error:', { statusCode, errorData });
    } else {
      console.error('Error desconocido:', error);
    }
    return null;
  }
};