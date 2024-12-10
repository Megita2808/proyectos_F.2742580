"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/administrador/tablas/catalogo/categoria";
import { getCategorias } from "@/service/api/catalogo/categoria/TodoCategoria";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; col2: string; col3: string; col4: string; enabled: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategorias = async () => {
        try {
            setIsLoading(true);
            const categorias = await getCategorias();
            
            const formattedData = categorias.map((categoria, index) => ({
                col1: index + 1,
                col2: categoria.nombreCategoria,
                col3: categoria._id,
                col4: categoria.imagen,
                enabled: categoria.estado
            }));
            setData(formattedData);
        } catch (error) {
            console.error("Error fetching categories:", error);
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
                <h1 className="TituloTabla">Categoría</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <DataTable data={data} setRefreshData={fetchCategorias} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
