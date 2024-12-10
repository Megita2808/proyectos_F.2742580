import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface Distribuidor {
    _id: string;
    nombreEmpresa: string;
    CorreoEmpresa: string;
    telefono: string;
    estado: string;
    direcciones: {
        departamentos: {
            nombreDepartamento: string;
            ciudades: {
                nombreCiudad: string;
                locacionExacta: {
                    locacion: string;
                }[];
            }[];
        }[];
    };
}

export const getDistribuidoresPorEstado = async (estado: string): Promise<Distribuidor[]> => {
    try {
        const response: AxiosResponse<Distribuidor[]> = await axios2.get<Distribuidor[]>('/api/distribuidores/estado/' + estado);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return [];
        } else {
            return [];
        }
    }
};
