import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

export interface Area {
  ancho: number;
  largo: number;
}

export interface PesoPersonalizado {
  valor: number;
  unidad: string;
}

export interface MedidaVenta {
  _id: string;
  medida: string;
  longitud: number | Area;
  peso: string | PesoPersonalizado;
  color: string;
  cantidad: string;
  total: number;
  precioVenta: string | undefined;
}

export interface MedidaProducto {
  _id: string;
  medida: string;
  longitud: number | Area;
  peso: string | PesoPersonalizado | null;
  color: string;
  cantidad: string;
  total: number;
  precioVenta: string | undefined;
}

export interface DetalleVenta {
  medidasProducto: MedidaProducto[] | [];
  medidasVenta: MedidaVenta[] | [];
  tipoVenta: string;
  usuario: Usuario;
  fechaVenta: Date;
  fechaEntrega: Date;
  subTotal: number;
}

export interface Usuario {
  _id: string;
  nombre: string;
  correo: string;
}

export interface Venta {
  _id: string;
  detalleVenta: DetalleVenta;
  tipoVenta: string;
  subTotal: number;
  usuario: Usuario;
  fechaVenta: Date;
  fechaEntrega: Date;
  estado: boolean;
}

interface GetVentasResponse {
  ventas: Venta[];
}

export const getVentas = async (): Promise<GetVentasResponse | void> => {
  try {
    const response: AxiosResponse<GetVentasResponse> = await axios2.get<GetVentasResponse>('/api/ventas');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};
