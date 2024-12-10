export interface DatoPermiso {
    _id: string;
    nombrePermiso: string;
    descripcionPermiso: string;
}

export interface DataRowRol{
    col1: number;
    identificador: string;
    nombreRol: string;
    extraPorcentaje: number;
    permisos: DatoPermiso[];
    enabled: boolean;
}