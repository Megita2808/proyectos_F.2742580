export interface DataRowMedidaVenta {
    col1: number; 
    id: string; 
    medidaProducto: string;  
    medidaVenta: string;
    longitudMedidaModificado: string; 
    unidadMedida: string; 
    precioUnitarioModificado: string; 
    enabled: boolean 
    peso: number; 
    unidadMedidaSimbolo: string; 
    idUnidadMedidaPeso: string; 
    longitud: number; 
    precioUnitario: number; 
    idMedidaProducto: string;
    idUnidadMedida: string;
    idPeso: string;
    idPrecioUnitario: string;
    urlImagen: string;
    datosPesoTodo: Peso;
    datosColoresTodo: ColoresInterface;
}

export interface PesoMedidaVenta {
    valores: { valor: string }[];
    unidadMedida: string;
}

export interface Colores {
    PrecioVenta: string;
    imagen: string ;
}

interface UnidadMedida {
    _id: string;
    simbolo: string;
 }

interface PrecioVenta {
    _id: string;
    unidadMedida: UnidadMedida;
}
  
interface PesoValor {
    _id: string;
}
  
export interface Peso {
    valores: {
      valor: PesoValor;
    }[];
}

export interface Color {
    PrecioVenta: PrecioVenta;
    imagen: string;
    _id: string;
    idImagen: string;
}

export interface ColoresInterface {
    colores: Color[];
}
