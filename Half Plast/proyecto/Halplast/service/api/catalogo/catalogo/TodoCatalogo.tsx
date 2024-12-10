import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';
import { CatalogoResponse, Categoria } from '@/components/administrador/tablas/tiposFilas/catalogo';

export const getCatalogo = async (): Promise<Categoria[]> => {
    try {
        const response: AxiosResponse<CatalogoResponse> = await axios2.get<CatalogoResponse>('/api/catalogoCompleto');
        
        if (response.data && Array.isArray(response.data.catalogo)) {
            if (response.data.catalogo.length > 0) {
                return response.data.catalogo;
            } else {
                console.warn('El array "catalogo" está vacío.');
                return [];
            }
        } else {
            console.error('La respuesta de la API no contiene el campo "catalogo" como se esperaba.');
            return [];
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Error en la solicitud:', error.response?.data || error.message);
        } else {
            console.error('Error desconocido:', error);
        }
        return [];
    }
};
