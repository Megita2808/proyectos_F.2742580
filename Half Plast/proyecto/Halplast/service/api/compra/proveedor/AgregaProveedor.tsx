import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface RespuestaProveedor {
  status: number;
  msg: string;
}

const AgregarProveedor = async (
  nombre: string,
  correo: string,
  telefono: string,
  tipoDocumento: string,
  documento: string,
  direccion: string, 
  departamento: string,
  municipio: string,
  selected: google.maps.LatLngLiteral,
): Promise<RespuestaProveedor | void> => {
  
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

    const response: AxiosResponse = await axios2.post('/api/proveedor', {
      nombre,
      correo,
      telefono,
      tipoDocumento,
      documento,
      direccion: direccionFormateada,
    });

    return {
      status: response.status,
      msg: 'Proveedor registrado correctamente'
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

export default AgregarProveedor;
