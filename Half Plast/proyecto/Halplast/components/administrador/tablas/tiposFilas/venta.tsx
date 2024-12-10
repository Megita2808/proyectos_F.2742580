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

export interface MedidaVentaEnviar {
  _id: string;
  medida: string;
  longitud: number | Area;
  peso: string | PesoPersonalizado;
  color: string;
  nombercolor: string;
  precioVenta: string;
  cantidad: number;
  total: number;
  producto: string;
}

export interface MedidaProductoEnviar {
  _id: string;
  medida: string;
  longitud: number | Area;
  peso: string | PesoPersonalizado;
  color: string;
  nombercolor: string;
  precioVenta: string;
  cantidad: number;
  total: number;
  producto: string;
}

export interface DetalleVentaEnviar {
  medidasProducto: MedidaProductoEnviar[] | null;
  medidasVenta: MedidaVentaEnviar[] | null;
}

export interface DetalleVenta {
  medidasProducto: MedidaProducto[] | null;
  medidasVenta: MedidaVenta[] | null;
}

export interface Usuario {
  _id: string;
  nombre: string;
  correo: string;
}

export interface DataRowVenta {
  col1: number;
  _id: string;
  detalleVenta: DetalleVenta;
  tipoVenta: string;
  usuario: Usuario;
  fechaVenta: string;
  fechaEntrega: string;
  totalVenta: number;
  estado: boolean;
}
