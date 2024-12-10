import { Direccion } from "@/service/api/compra/proveedor/TodoProveedor";

export interface dataRol {
    _id: string;
    nombreRol: string;
    extraPorcentaje: number;
}

export interface DataRowUsuario {
    col1: number;
    identificador: string;
    nombre: string;
    correo: string;
    telefono:string;
    rol: dataRol;
    nombreRol: string;
    enabled: boolean;
    direccion: Direccion[];
}