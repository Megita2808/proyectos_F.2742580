import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

  
interface funcionDatosResponse {
    msg: string;
    status: number | null;
}
  
const EditarEstadoVentaGeneral = async (
  id_envio: string, 
  id_venta: string, 
  estadoEntrada: string, 
  EstadoEntradaDescripcion: string, 
  motivoEntrada: string, 
): Promise<funcionDatosResponse> => {

  if (!id_envio && !id_venta) {
    console.error('Necesitas una venta o envio a la cual hacerle cambios');
    return { msg: 'error', status: 400 };
  }
  
  try {
    const response: AxiosResponse<funcionDatosResponse> = await axios2.post<funcionDatosResponse>('/api/cambiarEstado/General' ,{
        id_envio,
        id_venta,
        estadoEntrada,
        EstadoEntradaDescripcion,
        motivoEntrada,
    });
    
    return response.data ;
  }catch (error: unknown) {
    let errorStatus = null;

    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
      errorStatus = error.response?.status || 500;
    } else {
      console.error('Error desconocido:', error);
    }

    return { msg: 'error', status: errorStatus };
  }
};

export default EditarEstadoVentaGeneral;
