import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoCategoria {
  nombreProducto: string;
  id_Categoria: string;
  imagen: string;
}

const AgregarProducto = async (
  nombreProducto: string, 
  id_Categoria: string, 
  imagen: string,
): Promise<DatoCategoria | void> => {

  if (nombreProducto.length < 2) {
    console.error('El nombre del producto debe tener al menos 1 digito');
    return
  }

  try {
    const response: AxiosResponse<DatoCategoria> = await axios2.post<DatoCategoria>('/api/producto' ,{
      nombreProducto,
      id_Categoria,
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

export default AgregarProducto;
