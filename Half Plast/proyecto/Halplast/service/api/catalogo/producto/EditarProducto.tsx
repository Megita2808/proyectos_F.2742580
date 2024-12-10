import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosCategoria {
  nombreCategoria: string;
  _id: string;
  id_Categoria: string
  imagen: string;
}

const EditarCategoria = async (
  nombreProducto: string, 
  _id: string,
  id_Categoria: string,
  imagen: string,
): Promise<DatosCategoria | void> => {

  if (nombreProducto.length < 2) {
    console.error('El nombre del producto debe tener al menos 1 digito');
    return
  }
  try {
    const response: AxiosResponse<DatosCategoria> = await axios2.put<DatosCategoria>('/api/producto/'+_id, {
      nombreProducto,
      id_Categoria,
      imagen
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

export default EditarCategoria;
