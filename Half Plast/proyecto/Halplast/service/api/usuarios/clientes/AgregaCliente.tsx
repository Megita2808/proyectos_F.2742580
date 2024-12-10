import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface RespuestaUsuario {
  status: number;
  msg: string;
}

const AgregarUsuario = async (
  nombre: string,
  password: string,
  correo: string,
  telefono:string,
  rolId: string,
  direccion: string, 
  departamento: string,
  municipio: string,
  selected: google.maps.LatLngLiteral,
): Promise<RespuestaUsuario | void> => {

  try {
    const direccionFormateada = {
      proveedor: correo,
      nombreDepartamento: departamento,
      ciudades: [
        {
          nombreCiudad: municipio,
          locaciones: [
            {
              coordenadas: {
                latitud: selected.lat,
                longitud: selected.lng,
              },
              locacion: direccion
            }
          ]
        }
      ]
    };
    const response: AxiosResponse<RespuestaUsuario> = await axios2.post<RespuestaUsuario>('/api/usuarios' ,{
      nombre,
      password,
      correo,
      telefono,
      rolId,
      direccion: direccionFormateada,
    });

    return {
      status: response.status,
      msg: 'Usuario registrado correctamente'
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        msg: error.response.data.error || 'Ocurrió un error en la solicitud.'
      };
    } else {
      console.error('Error desconocido:', error);
      return {
        status: 500,
        msg: 'Error desconocido en la solicitud'
      };
    }
  }
};

export default AgregarUsuario;
