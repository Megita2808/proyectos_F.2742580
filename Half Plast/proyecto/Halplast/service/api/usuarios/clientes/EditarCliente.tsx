import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosPermiso {
  msg: string;
  status: number;
}

const EditarUsuarios= async (
  _id: string,
  nombre: string,
  correo: string,
  telefono:string,
  rol: string,
  direccion: string, 
  departamento: string,
  municipio: string,
  selected: google.maps.LatLngLiteral,
  idDireccion: string,
  direccionEditada: boolean
): Promise<DatosPermiso | void> => {

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

    console.log(_id)
    console.log(nombre)
    console.log(correo)
    console.log(telefono)
    console.log(rol)
    console.log(direccion)
    console.log(idDireccion)
    console.log(direccionEditada)
    const response: AxiosResponse<DatosPermiso> = await axios2.put<DatosPermiso>('/api/usuarios/'+_id, {
      nombre,
      correo,
      telefono,
      rol,
      direccion: direccionFormateada,
      idDireccion,
      direccionEditada,
    });

    return {
      status: response.status,
      msg:  response.data.msg || 'Ocurrió un error en la solicitud.'
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        msg: error.response.data.error || 'Ocurrió un error en la solicitud.'
      };
    } else {
      return {
        status: 500,
        msg: 'Error desconocido en la solicitud'
      };
    }
  }
};

export default EditarUsuarios;
