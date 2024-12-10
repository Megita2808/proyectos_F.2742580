import { Direccion } from "@/service/api/compra/proveedor/TodoProveedor";

export interface DataRowProveedor {
    col1: number;
    identificador: string;
    nombre: string;
    correo: string;
    telefono:string;
    numeroDocumento:string;
    tipoDocumento:string;
    enabled: boolean;
    direccion: Direccion[];
}