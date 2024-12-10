import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface RespuestaSolicitudUsuario {
  status: number;
  msg: string;
  data?: {
    encryptedCode: string;
    iv: string;
  };
}

const SolicitudRecuperarContraseña = async (
  correo: string,
): Promise<RespuestaSolicitudUsuario | void> => {
    try {
        const response: AxiosResponse<RespuestaSolicitudUsuario> = await axios2.post<RespuestaSolicitudUsuario>('/api/usuarios/recuperarPassword' ,{
            correo
        });
        if (response.data.data) {
            return {
              status: response.status,
              msg: 'Solicitud enviada correctamente',
              data: response.data.data,
            };
          }
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

export default SolicitudRecuperarContraseña;
