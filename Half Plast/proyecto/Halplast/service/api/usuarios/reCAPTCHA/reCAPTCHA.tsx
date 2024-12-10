
import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

export const enviarTokenRecaptcha = async (token: string) => {
    try {
      const response: AxiosResponse = await axios2.post('/api/ValidarReCaptcha',{
        token,
      });
      return response.status;
    } catch (error) {
        console.error('Error al enviar el token de reCAPTCHA:', error);
    }
};