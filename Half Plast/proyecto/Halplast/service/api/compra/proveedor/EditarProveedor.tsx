import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface RespuestaProveedor {
  status: number;
  msg: string;
}

const EditarPeoveedor = async (
  _id: string,
  nombre: string,
  correo: string,
  telefono: string,
  documento: string,
  tipoDocumento: string,
  direccion: string, 
  departamento: string,
  municipio: string,
  selected: google.maps.LatLngLiteral,
  idDireccion: string,
  direccionEditada: boolean
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
    const response: AxiosResponse<RespuestaProveedor> = await axios2.put<RespuestaProveedor>('/api/proveedor/'+_id, {
      nombre,
      correo,
      telefono,
      tipoDocumento,
      documento,
      direccion: direccionFormateada,
      idDireccion,
      direccionEditada,
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

export default EditarPeoveedor;
