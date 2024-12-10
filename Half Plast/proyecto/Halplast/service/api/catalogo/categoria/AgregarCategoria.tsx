import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoCategoria {
  nombreCategoria: string;
  imagen: string;
}

const AgregarCategoria = async (
  nombreCategoria: string, 
  imagen: string, 
): Promise<DatoCategoria | void> => {

  if (nombreCategoria.length < 2) {
    console.error('La contraseña debe tener al menos 1 digito');
    return
  }

  try {
    const response: AxiosResponse<DatoCategoria> = await axios2.post<DatoCategoria>('/api/categoria' ,{
      nombreCategoria,
      imagen,
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

export default AgregarCategoria;
