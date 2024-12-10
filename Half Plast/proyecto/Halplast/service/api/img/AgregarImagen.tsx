import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoImagen {
  imageId: string;
  ok: boolean;
}

const AgregarImagen = async (
  nombreModulo: string,
  formData: FormData,
): Promise<string | void> => {
  try {
    const response: AxiosResponse<DatoImagen> = await axios2.post<DatoImagen>(
      `/api/imagen/${nombreModulo}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.ok) {
      return response.data.imageId;
    } else {
      throw new Error('La respuesta no fue exitosa');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
};

export default AgregarImagen;
