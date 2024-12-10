"use client";

import React, { useEffect, useState } from "react";
import TablaRoles from "@/components/administrador/tablas/usuario/configuracion/roles/rol";
import { getRoles, DatoPermiso } from "@/service/api/configuracion/rol/TodoRol";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; identificador: string; nombreRol: string; extraPorcentaje:number; permisos: DatoPermiso[], enabled: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetcPesos= async () => {
        try {
            setIsLoading(true);
            const roles = await getRoles();
            
            const formattedData = roles.map((rol, index) => ({
                col1: index + 1,
                identificador: rol._id,
                nombreRol: rol.nombreRol,
                extraPorcentaje: rol.extraPorcentaje,
                permisos: rol.permisos,
                enabled: rol.estado
            }));
            setData(formattedData)
        } catch (error) {
            console.error("Error obteniendo los roles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetcPesos();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Rol</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaRoles data={data} setRefreshData={fetcPesos} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
