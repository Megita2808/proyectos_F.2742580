"use client";

import React, { useEffect, useState } from "react";
import TablaPermisos from "@/components/administrador/tablas/usuario/configuracion/permisos/permiso";
import { getPermisos } from "@/service/api/configuracion/permiso/TodoPermiso";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; identificador: string; nombrePermiso: string; descripcionPermiso:string; enabled: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPermisos= async () => {
        try {
            setIsLoading(true);
            const permisos = await getPermisos();
            
            const formattedData = permisos.map((permiso, index) => ({
                col1: index + 1,
                identificador: permiso._id,
                nombrePermiso: permiso.nombrePermiso,
                descripcionPermiso: permiso.descripcionPermiso,
                enabled: permiso.estado
            }));
            setData(formattedData)
        } catch (error) {
            console.error("Error obteniendo los colores:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPermisos();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Permisos</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaPermisos data={data} setRefreshData={fetchPermisos} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
