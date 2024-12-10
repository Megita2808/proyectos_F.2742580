import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface Distribuidor {
    nombreEmpresa: string;
    CorreoEmpresa: string;
    telefono: string;
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

const AgregarDistribuidor = async (
    formData: {
        nombreEmpresa: string;
        ubicacion: string;
        emailEmpresa: string;
        telefono: string;
    },
    DepartamentoSeleccionado: { identificador: string; nombre: string },
    MunicipioSeleccionado: { identificador: string; nombre: string }
): Promise<number | void> => {
    try {
        const response: AxiosResponse<Distribuidor> = await axios2.post<Distribuidor>('/api/distribuidor', {
            nombreEmpresa: formData.nombreEmpresa,
            CorreoEmpresa: formData.emailEmpresa,
            telefono: formData.telefono,
            direccion : {
                usuario: formData.emailEmpresa,
                nombreDepartamento: DepartamentoSeleccionado.nombre,
                ciudades: [
                  {
                    nombreCiudad: MunicipioSeleccionado.nombre,
                    locaciones: [
                        {
                            locacion: formData.ubicacion,
                            coordenadas: {
                                latitud: 12312,
                                longitud: 123123
                            }
                        }
                    ]
                  }
                ]
            },
        });

        return response.status;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Error en la solicitud:', error.response?.data || error.message);
        } else {
            console.error('Error desconocido:', error);
        }
    }
};

export default AgregarDistribuidor;
