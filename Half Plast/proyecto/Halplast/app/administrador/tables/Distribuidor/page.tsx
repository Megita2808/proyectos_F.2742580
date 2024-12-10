"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/administrador/tablas/usuario/distribuidor/estandar";
import { getDistribuidoresTodos } from "@/service/api/usuarios/distribuidor/ObtenerDistribuidoresTodos";

const DistribuidoresActivos: React.FC = () => {
    const [data, setData] = useState<{ col1: number; identificador: string; nombreEmpresa: string; correoEmpresa: string; telefono: string; Direccion: string; estado: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDistribuidores = async () => {
        try {
            setIsLoading(true);
            const distribuidores = await getDistribuidoresTodos(); 
            const formattedData = distribuidores.distribuidores.map((distribuidor, index) => ({
                col1: index + 1,
                identificador: distribuidor._id,
                nombreEmpresa: distribuidor.nombreEmpresa,
                correoEmpresa: distribuidor.CorreoEmpresa,
                telefono: distribuidor.telefono,
                Direccion: distribuidor.direccion.map(direccion => direccion.departamento +' '+  direccion.ciudad +' '+  direccion.locaciones.map(locacion => locacion.locacion).join(", ")).join(", "),
                estado: distribuidor.estado
            }));
            setData(formattedData);
        } catch (error) {
            console.error("Error fetching distribuidores:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDistribuidores();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Distribuidores</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <DataTable data={data} setRefreshData={fetchDistribuidores} />
                )}
            </div>
        </div>
    );
};

export default DistribuidoresActivos;
