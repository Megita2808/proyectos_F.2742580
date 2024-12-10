import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface Imagen {
  _id: string;
  imageUrl: string;
  description?: string;
  uploadedAt: Date;
  githubPath: string;
  altText?: string;
  isActive: boolean;
}

interface Modulo {
  _id: string;
  moduleName: string;
  images: Imagen[];
}

interface GetImagenesResponse {
  modules: Modulo[];
}

export const getImagenes = async (): Promise<Modulo[]> => {
  try {
    const response: AxiosResponse<GetImagenesResponse> = await axios2.get<GetImagenesResponse>('/api/imagen');
    const modules = response.data.modules;
    return modules;
  } catch (error: unknown) {
    console.error("Error fetching images:", error);
    return [];
  }
};