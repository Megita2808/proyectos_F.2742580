export interface UnidadMedida {
    _id: string;
    nombre: string;
    simbolo: string;
  }
  
  export interface PesoValor {
    _id: string;
    peso: number;
  }
  
  export interface PrecioVenta {
    PrecioVenta: {
      _id: string;
      precioUnitario: string;
      unidadMedida: UnidadMedida;
      color: {
        _id: string;
        nombreColor: string;
      };
    };
  }

  export interface ColorDatosFormatoGetColor {
    color: string;
    precioUnitario: number;
    unidadMedida: string;
    _id: string;
    nombreColor: string;
  }

  export interface Colores {
    _id: string;
    PrecioVenta: PrecioVenta;
    imagen: string;
    idImagen: string;
  }
  
  export interface MedidaProducto {
    _id: string;
    longitudMedida: {
        valor: number;
        unidadMedida: UnidadMedida;
    };
    peso: {
        valores: {
        _id: string;
        valor: PesoValor;
        }[];
        unidadMedida: UnidadMedida;
    };
    colores: Colores[];
  }
  
  export interface CompraDetalleGet {
    medidaProducto: MedidaProducto;
    color: ColorDatosFormatoGetColor;
    cantidad: number;
    total: number;
    proveedor: {
      _id: string;
      nombre: string;
    };
    producto: string;
  }
  
  export interface CompraDetalle {
    medidaProducto: MedidaProducto;
    color: PrecioVenta;
    cantidad: number;
    total: number;
    proveedor: {
      _id: string;
      nombre: string;
    };
    producto: string;
  }
  
  
  export interface DataRowCompraGet {
    col1: number ;
    _id: string;
    detalleCompra: CompraDetalleGet[];
    fechaCompra: string;
    totalCompra: number;
    estado: boolean;
  }
  

  export interface DataRowCompra {
    col1: number ;
    _id: string;
    detalleCompra: CompraDetalle[];
    fechaCompra: string;
    totalCompra: number;
    estado: boolean;
  }
  
  