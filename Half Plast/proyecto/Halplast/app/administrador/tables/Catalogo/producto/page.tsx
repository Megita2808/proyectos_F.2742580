"use client";

import React, { useEffect, useState } from "react";
import TablaProductos from "@/components/administrador/tablas/catalogo/producto";
import { getProductos } from "@/service/api/catalogo/producto/TodoProducto";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; col2: string; col3: string;  col4: string; col5: string;enabled: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategorias = async () => {
        try {
            setIsLoading(true);
            const productos = await getProductos();
            
            const formattedData = productos.map((producto, index) => ({
                col1: index + 1,
                col2: producto.nombreProducto,
                col3: producto._id,
                col4: producto.categoria,
                col5: producto.imagen,
                enabled: producto.estado
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
                <h1 className="TituloTabla">Producto</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaProductos data={data} setRefreshData={fetchCategorias} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
