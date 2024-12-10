import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface Coordenadas {
  latitud: number;
  longitud: number;
}

interface LocacionData {
  coordenadas: Coordenadas;
  locacion: string;
  estado: boolean;
  _id: string;
}

interface CiudadData {
  departamento: string;
  ciudad: string;
  locaciones: LocacionData[];
}

interface ApiResponse {
  tipo: string;
  locaciones: CiudadData[];
}

interface Locacion {
  departamento: string;
  ciudad: string;
  locacion: string;
  coordenadas: Coordenadas;
  identificadorLocacion: string;
}

export const getLocacionesDelUsuarioFind = async (identificadorUsuario: string): Promise<Locacion[]> => {
  try {

    if (!identificadorUsuario) {
      console.error('Error: ID de usuario no disponible');
      return [];
    }

    const response: AxiosResponse<ApiResponse> = await axios2.get<ApiResponse>(`/api/direcciones/usuario/${identificadorUsuario}`);
    
    const locaciones: Locacion[] = response.data.locaciones.flatMap((ciudadData) =>
      ciudadData.locaciones.map((loc) => ({
        departamento: ciudadData.departamento,
        ciudad: ciudadData.ciudad,
        locacion: loc.locacion,
        coordenadas: loc.coordenadas,
        identificadorLocacion: loc._id,
      }))
    );

    return locaciones;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};
