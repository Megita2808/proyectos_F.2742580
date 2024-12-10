import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

export interface datosVenta{
  _id: string;
  fechaVenta: Date;
  subTotal: number;
}

interface datosUsuario{
  _id: string;
  nombre: string;
  correo: string;
}

interface dataLocacionesInternas{
  coordenadas: {
    latitud: number,
    longitud: number
  };
  locacion: string,
  _id: string
}

interface dataLocaciones{
  departamento: string;
  ciudad: string;
  locaciones: dataLocacionesInternas;
}

export interface datosEnvio{
  _id: string;
  totalEnvio: number;
  venta: datosVenta;
  usuario: datosUsuario;
  locaciones: dataLocaciones[];
}

interface datosDetalleVenta{
  _id: string;
  total: number;
}

export interface datosCompra{
  _id: string;
  fechaCompra: Date;
  detalleCompra: datosDetalleVenta[];
}

export interface datosCategoria{
  _id: string;
  nombreCategoria: Date;
  producto: string[];
}

interface GetEnviosResponse {
  msg : string;
  DatosEnvio : datosEnvio[];
  DatosVenta : datosVenta[];
  DatosCompra : datosCompra[];
  DatosCategoria : datosCategoria[];
}

export const getDatosDashboard = async (): Promise<GetEnviosResponse | void> => {
  try {
    const response: AxiosResponse<GetEnviosResponse> = await axios2.get<GetEnviosResponse>('/api/dashboardDatos');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};
