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

export interface Ventas {
  _id: string;
  detalleVenta: DetalleVenta;
  tipoVenta: string;
  subTotal: number;
  usuario: Usuario;
  fechaVenta: Date;
  fechaEntrega: Date;
  estado: boolean;
}

interface Coordenadas {
  latitud: number;
  longitud: number;
}

interface LocacionData {
  coordenadas: Coordenadas;

  estado: boolean;
  _id: string;
}

export interface CiudadData {
  departamento: string;
  ciudad: string;
  locaciones: LocacionData;
  locacion: string;
}

export interface DataRowEnvio {
  col1: number;
  _id: string;
  estadoEnvio: string;
  totalEnvio: number;
  direccion: string;
  usuario: Usuario;
  locaciones: CiudadData;
  detalleVenta: Ventas;
}