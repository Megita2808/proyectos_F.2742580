import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoImagen {
  nombreModulo: string;
  formData: FormData;
}

const EditarCategoria = async (
  nombreModulo: string,
  formData: FormData
): Promise<DatoImagen | void> => {
  try {

    const config: AxiosRequestConfig = {};
  
    if (formData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
  
    const response: AxiosResponse<DatoImagen> = await axios2.put<DatoImagen>(
      `/api/imagen/${nombreModulo}`,
      formData,
      config
    );
  
    return response.data;
  }catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EditarCategoria;
