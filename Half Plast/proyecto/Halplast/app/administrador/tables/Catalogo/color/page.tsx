"use client";

import React, { useEffect, useState } from "react";
import TablaColores from "@/components/administrador/tablas/catalogo/color";
import { getColores } from "@/service/api/catalogo/color/TodoColor";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; col2: string; col3: string; enabled: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategorias = async () => {
        try {
            setIsLoading(true);
            const colores = await getColores();
            
            const formattedData = colores.map((color, index) => ({
                col1: index + 1,
                col2: color.nombreColor,
                col3: color._id,
                enabled: color.estado
            }));
            setData(formattedData);
        } catch (error) {
            console.error("Error obteniendo los colores:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Colores</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaColores data={data} setRefreshData={fetchCategorias} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
