"use client";

import React, { useEffect, useState } from "react";
import TablaPeso from "@/components/administrador/tablas/catalogo/peso";
import { getPesos } from "@/service/api/catalogo/peso/TodoPeso";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; col2: number; col3: string; col4: string; col5: string; col6: string; enabled: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetcPesos= async () => {
        try {
            setIsLoading(true);
            const colores = await getPesos();
            
            const formattedData = colores.map((peso, index) => ({
                col1: index + 1,
                col2: peso.peso,
                col3: peso._id,
                col4: peso.unidadMedida?.simbolo || "Sin simbolo",
                col5: peso.unidadMedida?.nombre || "Sin nombre",
                col6: peso.unidadMedida?._id || "Sin id",
                enabled: peso.estado
            }));
            setData(formattedData);
        } catch (error) {
            console.error("Error obteniendo los colores:", error);
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
                <h1 className="TituloTabla">Pesos</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaPeso data={data} setRefreshData={fetcPesos} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
