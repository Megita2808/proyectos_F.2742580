import { PrecioVenta } from "@/service/api/catalogo/medidaProducto/TodoMedidaProducto";

export interface DataRowMedidaProducto {
    col1: number; 
    id: string; 
    producto: string;  
    longitudMedidaModificado: string; 
    costoMedida: number; 
    pesoModificado: string; 
    unidadMedida: string; 
    precioUnitarioModificado: string; 
    enabled: boolean 
    peso: number; 
    unidadMedidaSimbolo: string; 
    idUnidadMedidaPeso: string; 
    longitud: number; 
    precioUnitario: number; 
    idProducto: string;
    idUnidadMedida: string;
    idPeso: string;
    idPrecioUnitario: string;
    existenciasCantidad: number;
    existenciasEquivalenciaSigno: string;
    existenciasEquivalencia: number;
    coloresCompleto: PrecioVenta[];
}