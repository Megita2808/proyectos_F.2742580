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
    _id: string;
    precioUnitario: string;
    unidadMedida: UnidadMedida;
    color: {
        _id: string;
        nombreColor: string;
    };
}

export interface Colores {
    _id: string;
    PrecioVenta: PrecioVenta;
    imagen: string;
    idImagen: string;
}

export interface MedidaVenta {
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
    medidaVenta: MedidaVenta[];
}

export interface Producto {
    _id: string;
    nombreProducto: string;
    medidaProducto: MedidaProducto[];
    imagenProducto: string;
}

export interface Categoria {
    _id: string;
    nombreCategoria: string;
    imagenCategoria: string;
    productos: Producto[];
}

export interface CatalogoResponse {
    catalogo: Categoria[];
}