import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface cordenadas {
    latitud: number;
    longitud: number;
}

interface Distribuidor {
    distribuidores: 
    [
        {    
            _id: string;
            nombreEmpresa: string;
            CorreoEmpresa: string;
            telefono: string;
            estado: string;
            direccion: [
                {
                    departamento: string;
                    ciudad: string;
                    locaciones: {
                        coordenadas: cordenadas;
                        estado: boolean;
                        locacion: string;
                        _id: string;
                    }[];
                }
            ]
        }
    ] | []
}



export const getDistribuidoresTodos = async (): Promise<Distribuidor> => {
    try {
        const response: AxiosResponse<Distribuidor> = await axios2.get<Distribuidor>('/api/distribuidores');
        return response.data;
    } catch (error: unknown) {
        const distribuidoresFormatoVacio: Distribuidor = {
            distribuidores: []
        };

        if (axios.isAxiosError(error)) {
            return distribuidoresFormatoVacio;
        } else {
            return distribuidoresFormatoVacio
        }
    }
};
