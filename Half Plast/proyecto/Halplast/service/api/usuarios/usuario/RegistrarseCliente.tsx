import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';
import { Dispatch } from 'redux';
import { login } from '@/redux/slice/userSlice';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface RegistrarClienteResponse {
  mensaje: string;
  correo: string;
  _id: string;
}

const RegistrarCliente = async (
  nombre: string, 
  correo: string, 
  telefono: string, 
  direccion: string, 
  departamento: string,
  municipio: string,
  selected: google.maps.LatLngLiteral | null,
  password: string, 
  router: ReturnType<typeof useRouter>
): Promise<RegistrarClienteResponse | void> => {

  try {

    if (selected === null) {
      Swal.fire('Correo inválido', 'Por favor ingrese un correo válido.', 'error');
      return;
    }
   
    const direccionFormateada = {
      usuario: '',
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

    console.log(direccionFormateada)
    const response: AxiosResponse<RegistrarClienteResponse> = await axios2.post<RegistrarClienteResponse>('/api/usuarios', {
      nombre,
      password,
      correo,
      telefono,
      rolId: '',
      direccion: direccionFormateada,
    });

    if (response.status === 200) {
      router.push('/');
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default RegistrarCliente;
