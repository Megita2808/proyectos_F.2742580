  import axios, { AxiosResponse } from 'axios';
  import axios2 from '@/utils/axiosConfig';

  interface Imagen {
    id: string;
    imageUrl: string;
  }

  interface Modulo {
    _id: string;
    moduleName: string;
    images: Imagen[];
  }

  interface ModuloResponse {
    ok: boolean;
    module: Modulo;
  }

  export const getImagenesModuloUnico = async (  
    nombreModulo: string
  ): Promise<Modulo | null> => {
    try {
      const response: AxiosResponse<ModuloResponse> = await axios2.get<ModuloResponse>(`/api/imagen/unico/${nombreModulo}`);
      
      const { module } = response.data;

      if (!module) {
        console.error("Módulo no encontrado");
        return null;
      }

      return module;
    } catch (error: unknown) {
      console.error("Error al obtener el módulo:", error);
      return null;
    }
  };
