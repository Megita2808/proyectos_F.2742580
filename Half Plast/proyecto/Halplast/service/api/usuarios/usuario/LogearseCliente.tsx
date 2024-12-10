import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';
import { Dispatch } from 'redux';
import { login } from '@/redux/slice/userSlice';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface ConfirmPasswordResponse {
  mensaje: string;
  status: string;
  msg: string;
  correo: string;
  _id: string;
  rol: {
    nombreRol: string;
    permisos: { nombrePermiso: string }[];
    extraPorcentaje: number;
  };
  token: string;
}

interface ConfirmPasswordResult {
  data: ConfirmPasswordResponse | null;
  status: number | null;
}

const confirmPassword = async (
  correo: string,
  password: string,
  dispatch: Dispatch,
  router: ReturnType<typeof useRouter>
): Promise<ConfirmPasswordResult> => {
  if (typeof correo !== 'string' || !correo.includes('@')) {
    console.error('Correo inválido');
    return { data: null, status: 400 };
  }

  if (typeof password !== 'string' || password.length < 6) {
    console.error('La contraseña debe tener al menos 6 caracteres');
    return { data: null, status: 400 };
  }

  try {
    const response: AxiosResponse<ConfirmPasswordResponse> = await axios2.post<ConfirmPasswordResponse>(
      '/api/usuarios/confirmarPassword',
      { correo, password }
    );

    if (response.status === 200) {
      const { correo, rol, token } = response.data;
      dispatch(login({ name: correo, rol, token }));
    }

    return { data: response.data, status: response.status };
  } catch (error: unknown) {
    let errorStatus = null;

    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
      errorStatus = error.response?.status || 500;
    } else {
      console.error('Error desconocido:', error);
    }

    return { data: null, status: errorStatus };
  }
};

export default confirmPassword;
