"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/administrador/tablas/catalogo/unidadMedida/unidadMedida";
import { getUnidadMedida } from "@/service/api/unidadMedida/TodoUnidadMedida";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; col2: string; col3: string; col4: string; col5: string;enabled: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUnidadesMedida = async () => {
        try {
            setIsLoading(true);
            const unidadesMedida = await getUnidadMedida();

            const formattedData = unidadesMedida.map((unidad, index) => ({
                col1: index + 1,
                col2: unidad.nombre ,
                col3: unidad._id,
                col4: unidad.simbolo,
                col5: unidad.tipo,
                enabled: unidad.estado
            }));

            setData(formattedData);
        } catch (error) {
            console.error("Error fetching unidades de medida:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUnidadesMedida();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Unidades de medida</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <DataTable data={data} setRefreshData={fetchUnidadesMedida} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
